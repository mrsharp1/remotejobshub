import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '';
let supabaseKey = ''; // SERVICE ROLE KEY required to bypass RLS for admin checks and inserting as test buyer
let anonKey = '';

envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts[0] === 'VITE_SUPABASE_URL') supabaseUrl = parts[1].trim();
    if (parts[0] === 'VITE_SUPABASE_SERVICE_ROLE_KEY') supabaseKey = parts[1].trim();
    if (parts[0] === 'VITE_SUPABASE_ANON_KEY') anonKey = parts[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2E() {
    console.log("==========================================");
    console.log("STARTING END-TO-END DISPUTE VERIFICATION");
    console.log("==========================================\n");

    try {
        // 1. Find an existing order
        const { data: order, error: orderErr } = await supabase
            .from('orders')
            .select('*')
            .in('status', ['payment_received', 'seller_processing', 'buyer_review'])
            .limit(1)
            .single();

        if (orderErr || !order) {
            console.log("Could not find a valid order for dispute test:", orderErr?.message);
            return;
        }

        console.log(`Found Test Order ID: ${order.id}`);
        console.log(`Buyer ID: ${order.buyer_id}`);
        console.log(`Current Status: ${order.status}\n`);

        // 2. Simulate Buyer opening dispute via disputeService logic
        console.log("-> Simulating buyer clicking 'Open Dispute'...");
        const disputeData = {
            order_id: order.id,
            opened_by: order.buyer_id,
            reason: 'Test End-To-End Dispute Reason'
        };

        const { data: dispute, error: disputeErr } = await supabase
            .from('disputes')
            .insert([{ ...disputeData, status: 'pending' }])
            .select()
            .single();

        if (disputeErr) throw disputeErr;
        console.log("✓ SUCCESS: Inserted into public.disputes");
        console.log("Dispute Payload:");
        console.log(JSON.stringify(dispute, null, 2), '\n');

        // 3. Update order and timeline (simulating disputeService.createDispute)
        const { data: updatedOrder, error: updateErr } = await supabase
            .from('orders')
            .update({ status: 'disputed' })
            .eq('id', order.id)
            .select()
            .single();

        if (updateErr) throw updateErr;
        console.log(`✓ SUCCESS: Order status updated to '${updatedOrder.status}'`);

        const { error: timelineErr } = await supabase
            .from('order_timeline')
            .insert([{
                order_id: order.id,
                status: 'disputed',
                notes: `Dispute opened. Reason: ${disputeData.reason}`
            }]);

        if (timelineErr) throw timelineErr;
        console.log("✓ SUCCESS: Order timeline entry created\n");

        // 4. Verify DB Row via raw select
        console.log("-> Executing: SELECT * FROM public.disputes ORDER BY created_at DESC LIMIT 1;");
        const { data: latestDispute, error: selectErr } = await supabase
            .from('disputes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (selectErr) throw selectErr;
        console.log("Row Returned:");
        console.log(JSON.stringify(latestDispute, null, 2), '\n');

        // 5. Verify Notifications
        console.log("-> Verifying Admin Notification was created...");
        // Get admin ID
        const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
        const adminId = admins?.[0]?.id;
        
        if (adminId) {
            const { data: notifications } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', adminId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            console.log("Latest Admin Notification:");
            console.log(JSON.stringify(notifications, null, 2), '\n');
            if (notifications && notifications.title.includes('Dispute')) {
                console.log("✓ SUCCESS: Admin notification verified");
            } else {
                console.log("✗ FAILED: Admin notification not found or title mismatch");
            }
        }

        // 6. Verify Admin Disputes Page Query
        console.log("\n-> Verifying Admin Disputes Query...");
        // Since we are using Service Role, it will succeed, but we want to check if the joins work
        const { data: adminDisputes, error: adminQErr } = await supabase
            .from('disputes')
            .select('*, order:orders(*, listing:listings(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*), admin:profiles!disputes_admin_id_fkey(*)')
            .eq('id', dispute.id)
            .single();

        if (adminQErr) throw adminQErr;
        console.log("✓ SUCCESS: Admin query returned JSON structure without errors");
        console.log("Admin Query Payload Snippet (Order Relationships):");
        console.log({
            id: adminDisputes.id,
            reason: adminDisputes.reason,
            order: adminDisputes.order ? "Embedded ✓" : "Missing ✗",
            opened_by_profile: adminDisputes.opened_by_profile ? "Embedded ✓" : "Missing ✗"
        });

    } catch (e: any) {
        console.error("\n!!! ERROR IN PIPELINE !!!");
        console.error(e.message || e);
    }
}

runE2E();

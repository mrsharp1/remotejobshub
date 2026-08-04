const { JSDOM } = require('jsdom');
const dom = new JSDOM('', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value.toString(); },
  removeItem(key) { delete this.store[key]; }
};

const legacyState = {
  state: {
    reviewsContent: {
      writtenReviews: [
        { id: '1', showOnHome: false }
      ],
      videoTestimonials: [
        { id: 'v1', showOnHome: true }
      ]
    },
    reviewsDraft: null
  },
  version: 0
};
localStorage.setItem('cms-storage', JSON.stringify(legacyState));

require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const { useCMSStore } = require('./src/services/cms/cms.store');

const state = useCMSStore.getState();

console.log('Migration Result:');
console.log('Video Testimonial:', state.reviewsContent.videoTestimonials[0]);
console.log('Written Review:', state.reviewsContent.writtenReviews[0]);

state.updateReviewsDraft({
  writtenReviews: state.reviewsContent.writtenReviews,
  videoTestimonials: [
    ...state.reviewsContent.videoTestimonials,
    { id: 'v2', showOnHomepage: true, showOnAbout: true }
  ]
});

console.log('\nAfter adding draft:');
console.log('Draft Videos:', useCMSStore.getState().reviewsDraft.videoTestimonials.length);
console.log('Live Videos:', useCMSStore.getState().reviewsContent.videoTestimonials.length);

state.publishReviews();

console.log('\nAfter publish:');
console.log('Draft Data:', useCMSStore.getState().reviewsDraft);
console.log('Live Videos:', useCMSStore.getState().reviewsContent.videoTestimonials.length);

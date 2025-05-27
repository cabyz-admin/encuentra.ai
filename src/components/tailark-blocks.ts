/**
 * Tailark Blocks - Complete Export Index
 * 
 * This file provides easy access to all Tailark marketing blocks
 * organized by category and variant.
 * 
 * Usage:
 * import { HeroSectionOne } from '@/components/tailark-blocks'
 * import { FeaturesTwoVariant } from '@/components/tailark-blocks'
 */

// Dusk Kit Blocks (Dark Theme)
export const DuskBlocks = {
  // Call to Action
  CallToActionOne: () => import('./blocks/call-to-action/one').then((m) => m.default),
  CallToActionTwo: () => import('./blocks/call-to-action/two').then((m) => m.default),
  CallToActionThree: () => import('./blocks/call-to-action/three').then((m) => m.default),

  // Comparator
  ComparatorOne: () => import('./blocks/comparator/one').then((m) => m.default),

  // Contact
  ContactOne: () => import('./blocks/contact/one').then((m) => m.default),
  ContactTwo: () => import('./blocks/contact/two').then((m) => m.default),

  // Content
  ContentOne: () => import('./blocks/content/one').then((m) => m.default),
  ContentTwo: () => import('./blocks/content/two').then((m) => m.default),
  ContentThree: () => import('./blocks/content/three').then((m) => m.default),
  ContentFour: () => import('./blocks/content/four').then((m) => m.default),
  ContentFive: () => import('./blocks/content/five').then((m) => m.default),
  ContentSix: () => import('./blocks/content/six').then((m) => m.default),
  ContentSeven: () => import('./blocks/content/seven').then((m) => m.default),

  // FAQs
  FaqsOne: () => import('./blocks/faqs/one').then((m) => m.default),
  FaqsTwo: () => import('./blocks/faqs/two').then((m) => m.default),
  FaqsThree: () => import('./blocks/faqs/three').then((m) => m.default),
  FaqsFour: () => import('./blocks/faqs/four').then((m) => m.default),

  // Features
  FeaturesOne: () => import('./blocks/features/one').then((m) => m.default),
  FeaturesTwo: () => import('./blocks/features/two').then((m) => m.default),
  FeaturesThree: () => import('./blocks/features/three').then((m) => m.default),
  FeaturesFour: () => import('./blocks/features/four').then((m) => m.default),
  FeaturesFive: () => import('./blocks/features/five').then((m) => m.default),
  FeaturesSix: () => import('./blocks/features/six').then((m) => m.default),
  FeaturesSeven: () => import('./blocks/features/seven').then((m) => m.default),
  FeaturesEight: () => import('./blocks/features/eight').then((m) => m.default),
  FeaturesNine: () => import('./blocks/features/nine').then((m) => m.default),
  FeaturesTen: () => import('./blocks/features/ten').then((m) => m.default),
  FeaturesEleven: () => import('./blocks/features/eleven').then((m) => m.default),
  FeaturesTwelve: () => import('./blocks/features/twelve').then((m) => m.default),

  // Footer
  FooterOne: () => import('./blocks/footer/one').then((m) => m.default),
  FooterTwo: () => import('./blocks/footer/two').then((m) => m.default),
  FooterThree: () => import('./blocks/footer/three').then((m) => m.default),
  FooterFour: () => import('./blocks/footer/four').then((m) => m.default),

  // Hero Section
  HeroSectionOne: () => import('./blocks/hero-section/one').then((m) => m.default),
  HeroSectionTwo: () => import('./blocks/hero-section/two').then((m) => m.default),
  HeroSectionThree: () => import('./blocks/hero-section/three').then((m) => m.default),
  HeroSectionFour: () => import('./blocks/hero-section/four').then((m) => m.default),
  HeroSectionFive: () => import('./blocks/hero-section/five').then((m) => m.default),
  HeroSectionSix: () => import('./blocks/hero-section/six').then((m) => m.default),
  HeroSectionSeven: () => import('./blocks/hero-section/seven').then((m) => m.default),
  HeroSectionEight: () => import('./blocks/hero-section/eight').then((m) => m.default),
  HeroSectionNine: () => import('./blocks/hero-section/nine').then((m) => m.default),

  // Integrations
  IntegrationsOne: () => import('./blocks/integrations/one').then((m) => m.default),
  IntegrationsTwo: () => import('./blocks/integrations/two').then((m) => m.default),

  // Auth Pages
  LoginOne: () => import('./blocks/login/one').then((m) => m.default),
  LoginTwo: () => import('./blocks/login/two').then((m) => m.default),
  SignUpOne: () => import('./blocks/sign-up/one').then((m) => m.default),
  SignUpTwo: () => import('./blocks/sign-up/two').then((m) => m.default),
  ForgotPasswordOne: () => import('./blocks/forgot-password/one').then((m) => m.default),

  // Logo Cloud
  LogoCloudOne: () => import('./blocks/logo-cloud/one').then((m) => m.default),
  LogoCloudTwo: () => import('./blocks/logo-cloud/two').then((m) => m.default),
  LogoCloudThree: () => import('./blocks/logo-cloud/three').then((m) => m.default),

  // Pricing
  PricingOne: () => import('./blocks/pricing/one').then((m) => m.default),
  PricingTwo: () => import('./blocks/pricing/two').then((m) => m.default),
  PricingThree: () => import('./blocks/pricing/three').then((m) => m.default),

  // Stats
  StatsOne: () => import('./blocks/stats/one').then((m) => m.default),
  StatsTwo: () => import('./blocks/stats/two').then((m) => m.default),
  StatsThree: () => import('./blocks/stats/three').then((m) => m.default),

  // Team
  TeamOne: () => import('./blocks/team/one').then((m) => m.default),
  TeamTwo: () => import('./blocks/team/two').then((m) => m.default),

  // Testimonials
  TestimonialsOne: () => import('./blocks/testimonials/one').then((m) => m.default),
  TestimonialsTwo: () => import('./blocks/testimonials/two').then((m) => m.default),
  TestimonialsThree: () => import('./blocks/testimonials/three').then((m) => m.default),
};

// Mist Kit Blocks (Light Theme)
export const MistBlocks = {
  // Call to Action
  CallToActionOne: () => import('./blocks-mist/call-to-action/one').then((m) => m.default),
  CallToActionTwo: () => import('./blocks-mist/call-to-action/two').then((m) => m.default),
  CallToActionThree: () => import('./blocks-mist/call-to-action/three').then((m) => m.default),

  // Comparator
  ComparatorOne: () => import('./blocks-mist/comparator/one').then((m) => m.default),

  // Contact
  ContactOne: () => import('./blocks-mist/contact/one').then((m) => m.default),
  ContactTwo: () => import('./blocks-mist/contact/two').then((m) => m.default),

  // Content
  ContentOne: () => import('./blocks-mist/content/one').then((m) => m.default),
  ContentTwo: () => import('./blocks-mist/content/two').then((m) => m.default),
  ContentThree: () => import('./blocks-mist/content/three').then((m) => m.default),
  ContentFour: () => import('./blocks-mist/content/four').then((m) => m.default),
  ContentFive: () => import('./blocks-mist/content/five').then((m) => m.default),
  ContentSix: () => import('./blocks-mist/content/six').then((m) => m.default),

  // FAQs
  FaqsOne: () => import('./blocks-mist/faqs/one').then((m) => m.default),
  FaqsTwo: () => import('./blocks-mist/faqs/two').then((m) => m.default),
  FaqsThree: () => import('./blocks-mist/faqs/three').then((m) => m.default),

  // Features
  FeaturesOne: () => import('./blocks-mist/features/one').then((m) => m.default),
  FeaturesTwo: () => import('./blocks-mist/features/two').then((m) => m.default),
  FeaturesThree: () => import('./blocks-mist/features/three').then((m) => m.default),
  FeaturesFour: () => import('./blocks-mist/features/four').then((m) => m.default),
  FeaturesFive: () => import('./blocks-mist/features/five').then((m) => m.default),
  FeaturesSix: () => import('./blocks-mist/features/six').then((m) => m.default),

  // Footer
  FooterOne: () => import('./blocks-mist/footer/one').then((m) => m.default),
  FooterTwo: () => import('./blocks-mist/footer/two').then((m) => m.default),
  FooterThree: () => import('./blocks-mist/footer/three').then((m) => m.default),

  // Hero Section
  HeroSectionOne: () => import('./blocks-mist/hero-section/one').then((m) => m.default),
  HeroSectionTwo: () => import('./blocks-mist/hero-section/two').then((m) => m.default),
  HeroSectionThree: () => import('./blocks-mist/hero-section/three').then((m) => m.default),
  HeroSectionFour: () => import('./blocks-mist/hero-section/four').then((m) => m.default),
  HeroSectionFive: () => import('./blocks-mist/hero-section/five').then((m) => m.default),
  HeroSectionSix: () => import('./blocks-mist/hero-section/six').then((m) => m.default),

  // Auth Pages
  LoginOne: () => import('./blocks-mist/login/one').then((m) => m.default),
  LoginTwo: () => import('./blocks-mist/login/two').then((m) => m.default),
  SignUpOne: () => import('./blocks-mist/sign-up/one').then((m) => m.default),
  SignUpTwo: () => import('./blocks-mist/sign-up/two').then((m) => m.default),
  ForgotPasswordOne: () => import('./blocks-mist/forgot-password/one').then((m) => m.default),

  // Logo Cloud
  LogoCloudOne: () => import('./blocks-mist/logo-cloud/one').then((m) => m.default),
  LogoCloudTwo: () => import('./blocks-mist/logo-cloud/two').then((m) => m.default),

  // Pricing
  PricingOne: () => import('./blocks-mist/pricing/one').then((m) => m.default),
  PricingTwo: () => import('./blocks-mist/pricing/two').then((m) => m.default),

  // Stats
  StatsOne: () => import('./blocks-mist/stats/one').then((m) => m.default),
  StatsTwo: () => import('./blocks-mist/stats/two').then((m) => m.default),

  // Team
  TeamOne: () => import('./blocks-mist/team/one').then((m) => m.default),
  TeamTwo: () => import('./blocks-mist/team/two').then((m) => m.default),

  // Testimonials
  TestimonialsOne: () => import('./blocks-mist/testimonials/one').then((m) => m.default),
  TestimonialsTwo: () => import('./blocks-mist/testimonials/two').then((m) => m.default),
  TestimonialsThree: () => import('./blocks-mist/testimonials/three').then((m) => m.default),
};

// Motion Primitives
export { TextEffect } from './motion-primitives/text-effect';
export { AnimatedGroup } from './motion-primitives/animated-group';

// Magic UI Components
export * from './magicui';

// Logos
export { default as Logo } from './logo';
export * from './logos';

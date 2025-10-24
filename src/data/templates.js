export const getTemplates = (t) => [
  {
    id: 1,
    title: t('templates.items.customerFeedback.title'),
    description: t('templates.items.customerFeedback.description'),
    icon: '📊',
    category: 'business',
    tags: t('templates.items.customerFeedback.tags', { returnObjects: true }),
    featured: true
  },
  {
    id: 2,
    title: t('templates.items.dataClean.title'),
    description: t('templates.items.dataClean.description'),
    icon: '🧹',
    category: 'research',
    tags: t('templates.items.dataClean.tags', { returnObjects: true })
  },
  {
    id: 3,
    title: t('templates.items.contentGeneration.title'),
    description: t('templates.items.contentGeneration.description'),
    icon: '✍️',
    category: 'social',
    tags: t('templates.items.contentGeneration.tags', { returnObjects: true })
  },
  {
    id: 4,
    title: t('templates.items.smartCustomerService.title'),
    description: t('templates.items.smartCustomerService.description'),
    icon: '💬',
    category: 'business',
    tags: t('templates.items.smartCustomerService.tags', { returnObjects: true })
  },
  {
    id: 5,
    title: t('templates.items.competitorMonitor.title'),
    description: t('templates.items.competitorMonitor.description'),
    icon: '🔍',
    category: 'business',
    tags: t('templates.items.competitorMonitor.tags', { returnObjects: true })
  },
  {
    id: 6,
    title: t('templates.items.codeReview.title'),
    description: t('templates.items.codeReview.description'),
    icon: '💻',
    category: 'technical',
    tags: t('templates.items.codeReview.tags', { returnObjects: true })
  },
  {
    id: 7,
    title: t('templates.items.meetingSummary.title'),
    description: t('templates.items.meetingSummary.description'),
    icon: '📝',
    category: 'business',
    tags: t('templates.items.meetingSummary.tags', { returnObjects: true })
  },
  {
    id: 8,
    title: t('templates.items.academicAssistant.title'),
    description: t('templates.items.academicAssistant.description'),
    icon: '🎓',
    category: 'research',
    tags: t('templates.items.academicAssistant.tags', { returnObjects: true })
  },
  {
    id: 9,
    title: t('templates.items.seoOptimization.title'),
    description: t('templates.items.seoOptimization.description'),
    icon: '📈',
    category: 'social',
    tags: t('templates.items.seoOptimization.tags', { returnObjects: true })
  },
  {
    id: 10,
    title: t('templates.items.emailClassification.title'),
    description: t('templates.items.emailClassification.description'),
    icon: '📧',
    category: 'business',
    tags: t('templates.items.emailClassification.tags', { returnObjects: true })
  },
  {
    id: 11,
    title: t('templates.items.financialAnalysis.title'),
    description: t('templates.items.financialAnalysis.description'),
    icon: '💰',
    category: 'business',
    tags: t('templates.items.financialAnalysis.tags', { returnObjects: true })
  },
  {
    id: 12,
    title: t('templates.items.apiTesting.title'),
    description: t('templates.items.apiTesting.description'),
    icon: '🔧',
    category: 'technical',
    tags: t('templates.items.apiTesting.tags', { returnObjects: true })
  }
];

export const getCategories = (t) => [
  { id: 'all', name: t('templates.categories.all') },
  { id: 'business', name: t('templates.categories.business') },
  { id: 'research', name: t('templates.categories.research') },
  { id: 'technical', name: t('templates.categories.technical') },
  { id: 'social', name: t('templates.categories.social') }
];


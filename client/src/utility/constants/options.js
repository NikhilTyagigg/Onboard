export const modeOptions = [
    { value: 'Formal', label: 'Formal' },
    { value: 'Creative', label: 'Creative' },
    { value: 'Simple', label: 'Simple' },
    { value: 'Informative', label: 'Informative' },
    { value: 'Witty', label: 'Witty' },
]

export const instagramIntentOptions = [
    { value: 'Promotional', label: 'Promotional' },
    { value: 'Educative', label: 'Educative' },
    { value: 'Engaging', label: 'Engaging' },
]

export const modeOptionsArray = ['Formal','Creative','Simple','Informative','Witty']


export const linkedinModeOptions = [
    { value: 'Formal', label: 'Formal' },
    { value: 'Creative', label: 'Creative' },
    { value: 'Simple', label: 'Simple' },
    { value: 'Informative', label: 'Informative' },
    { value: 'Witty', label: 'Witty' },
]

export const newModeOptions = [
    { value: 'Scientific', label: 'Scientific' },
    { value: 'Literary', label: 'Literary' },
    { value: 'Informative', label: 'Informative' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Humorous', label: 'Humorous' },
]

export const titleModeOptions = [
    { value: 'Formal', label: 'Formal' },
    { value: 'Witty', label: 'Witty' },
    { value: 'Simple', label: 'Simple' },
]

export const contentType = [
    { value: '-1', label: 'All' },
    //{ value: '6', label: 'Blog (CRUISE)' },
    { value: '22', label: 'Blog List' },
    { value: '14', label: 'Blog (PRO)' },
    { value: '23', label: 'Blog (User Content)'},
    { value: '2', label: 'Business Emails' },
    { value: '15', label: 'Google Text Ads' },    
    { value: '11', label: 'Instagram Post' },
    /*{ value: '7', label: 'LinkedIn Post' },*/
    { value: '20', label: 'LinkedIn Post' },
    { value: '19', label: 'Merge Your Content' },
    { value: '17', label: 'Product Description' },
    { value: '10', label: 'Rephrase Your Content' },
    /*{ value: '5', label: 'Short Form Content' },*/
    { value: '8', label: 'Short Form Content' },
    { value: '18', label: 'Thoughts Into Content' },
    { value: '16', label: 'Website Content' },
    
]

export const wordCountOptions = [
    { value: '50-100', label: '50-100' },
    { value: '100-200', label: '100-200' },
    { value: '200-300', label: '200-300' },
    { value: '300-400', label: '300-400' },
]

export const wordCountOptionsLinkedin = [
    { value: '100-200', label: '100-200' },
    { value: '300-400', label: '300-400' },
]

export const wordCountBlogPro = [
    { value: '1000', label: '900-1000' },
    { value: '2000', label: '1800-2000' },
]

export const textUpdateActions = {
    REGENERATE: 'REGENERATE',
    PARAPHRASE: 'PARAPHRASE',
    ADD_CONTENT: 'ADD_CONTENT'
}

export const emailIntentOptions = [
    { 
        value: 'Update customers on new functionalities', 
        label: 'Update customers on new functionalities',
        tag: 'UPDATE_FUNCTIONALITIES' 
    },
    { 
        value: 'Follow Up Email', 
        label: 'Follow Up Email',
        tag: 'FOLLOW_UP' 
    },
    { 
        value: 'Onboarding Email', 
        label: 'Onboarding Email',
        tag: 'ONBOARDING'
    },
    { 
        value: 'Resignation Email', 
        label: 'Resignation Email',
        tag: 'RESIGNATION'
    },

    { 
        value: '+ Write Your Use Case', 
        label: '+ Write Your Use Case',
        tag: 'ADD_YOUR_OWN'
    },
]

// 

export const googleAdsCategory = [
    { 
        value: 'Owned brands', 
        label: 'Owned brands',
        tag: 'Owned_brands'
    },
    { 
        value: 'Retail aggregator brands', 
        label: 'Retail aggregator brands',
        tag: 'Retail_Aggregator_Brands'
    }
]

export const websiteOptions = [   
    { 
        value: 'Mission and vision statement', 
        label: 'Mission and vision statement',
        tag: 'MISSION_AND_VISION'
    },
    { 
        value: 'Headline for homepage', 
        label: 'Headline for homepage',
        tag: 'HEADLINE_FOR_HOMEPAGE'
    },
    { 
        value: 'Brand Story', 
        label: 'Brand Story',
        tag: 'BRAND_STORY'
    },
    { 
        value: 'About The Team', 
        label: 'About The Team',
        tag: 'ABOUT_THE_TEAM'
    },
    { 
        value: 'Product/Service Descriptions', 
        label: 'Product/Service Descriptions',
        tag: 'PRODUCT_SERVICE_DESCRIPTIONS'
    }
]

export const emailSubIntentOptions = [
    { 
        value: 'Customer Communication', 
        label: 'Customer Communication',
        tag: 'CUSTOMER_COMMUNICATION'
    },
    { 
        value: 'Internal Communication', 
        label: 'Internal Communication',
        tag: 'INTERNAL_COMMUNICATION'
    },
    { 
        value: 'Minutes Of The Meeting', 
        label: 'Minutes Of The Meeting',
        tag: 'MINUTES_OF_THE_MEETING_EMAIL'
    },
    { 
        value: 'Follow Up', 
        label: 'Follow Up',
        tag: 'FOLLOW_UP' 
    },
    { 
        value: 'Redraft your mail', 
        label: 'Redraft your mail',
        tag: 'REDRAFT_YOUR_MAIL'
    },
    { 
        value: 'Create Your Own Use Case', 
        label: 'Create Your Own Use Case',
        tag: 'CREATE_YOUR_OWN_USE_CASE_EMAIL'
    },
]

export const emailTonality = [
    { 
        value: 'Formal', 
        label: 'Formal',
        tag: 'Formal'//'UPDATE_FUNCTIONALITIES' 
    },
    { 
        value: 'Persuasive', 
        label: 'Persuasive',
        tag: 'Persuasive' 
    },
    { 
        value: 'Empathetic', 
        label: 'Empathetic',
        tag: 'Empathetic'
    },
]

export const websiteTonality = [
    { 
        value: 'Informative', 
        label: 'Informative',
        tag: 'Informative' 
    },
    { 
        value: 'Creative', 
        label: 'Creative',
        tag: 'Creative' 
    },
    { 
        value: 'Formal', 
        label: 'Formal',
        tag: 'Formal'
    },
]

export const websiteOutputFormat = [
    { 
        value: 'Point', 
        label: 'Point',
        tag: 'Point' 
    },
    { 
        value: 'Short paragraph', 
        label: 'Short paragraph',
        tag: 'Short paragraph' 
    }
]

export const userStatus = [
    { 
        value: 'Active', 
        label: 'Active',
        tag: 'is_active' 
    },
    { 
        value: 'Deactive', 
        label: 'Deactive',
        tag: 'is_active' 
    },
    { 
        value: 'Approved', 
        label: 'Approved',
        tag: 'is_approved' 
    },
    { 
        value: 'Approval Pending', 
        label: 'Admin Approval Pending',
        tag: 'is_approved' 
    },
    { 
        value: 'Email Approval Pending', 
        label: 'Email Verification Pending',
        tag: 'is_email_verified' 
    },
    { 
        value: 'All', 
        label: 'All',
        tag: 'all' 
    }
]

export const productDescription = [
    { value: 'Ecommerce', label: 'Ecommerce', tag: "Ecommerce" },
    { value: 'Marketing', label: 'Marketing', tag: "Marketing" },
    { value: 'Sales', label: 'Sales', tag: "Sales" },
    { value: 'Website', label: 'Website', tag: "Website" }
]

export const productTonality = [   
    { 
        value: 'Formal', 
        label: 'Formal',
        tag: 'Formal'
    },
    { 
        value: 'Creative', 
        label: 'Creative',
        tag: 'Creative' 
    },
    {
        value: 'Informative', 
        label: 'Informative',
        tag: 'Informative' 
    }
]

export const productOutputFormat = [
    { 
        value: 'Point', 
        label: 'Point',
        tag: 'Point' 
    },
    { 
        value: 'Short paragraph', 
        label: 'Short paragraph',
        tag: 'Short paragraph' 
    }
]


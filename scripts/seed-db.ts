import { createQuiz } from '../lib/db'

const bizzNestDesignQuestions = [
  {
    type: 'multiple-choice-single' as const,
    question: `You are a UX designer for a popular mobile app that displays long lists of items. Users are reporting that the initial display of a new list feels abrupt or overwhelming. Which adjustment would you propose to make the list's initial appearance smoother and guide the user's eyes effectively into the content flow?`,
    options: [
      'Add a persistent "Load More" button at the bottom of the visible list.',
      'Implement a brief, subtle animation that reveals the list items one by one from the top down.',
      'Ensure the entire list loads and displays instantly, regardless of length.',
      'Introduce a large, prominent header above the list to anchor the user\'s focus.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Adobe Photoshop, what is the primary benefit of using Adjustment Layers instead of directly applying adjustments (e.g., Image > Adjustments > Brightness/Contrast) to an image layer?',
    options: [
      'They make the file size smaller.',
      'They are automatically applied to all open documents.',
      'They allow for non-destructive editing, meaning you can easily modify or remove the adjustment later.',
      'They can only be used on Smart Objects.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are conducting user experience research for a new mobile application. Which of the following methods would provide the most in-depth qualitative data on user behaviors and pain points?',
    options: [
      'A/B testing of different interface layouts.',
      'Large-scale online surveys with closed-ended questions.',
      'Usability testing with direct observation and think-aloud protocols.',
      'Analyzing website analytics for bounce rates and click-throughs.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are creating a logo in Adobe Illustrator that needs to be used on everything from a small business card to a large billboard without losing quality. Which type of graphic is most suitable for this purpose?',
    options: ['Raster Graphic', 'Pixel-based Graphic', 'Vector Graphic', 'Bitmap Image'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'When working on a complex layout in Adobe Illustrator, what is the primary benefit of using Layers?',
    options: [
      'To automatically align all objects on the artboard.',
      'To apply the same fill color to multiple objects at once.',
      'To organize and manage different elements of your design independently, allowing for easier editing and visibility control.',
      'To reduce the file size of the document.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: `You're beginning a new design project. What's the primary purpose of creating user personas at the outset?`,
    options: [
      'To identify potential marketing channels for the product.',
      "To understand the target users' needs, behaviors, and motivations.",
      'To determine the visual aesthetics and branding of the interface.',
      'To estimate the project timeline and resource allocation.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which of the following color models is primarily used for designs intended for digital screens (e.g., websites, mobile apps, social media)?',
    options: ['RGB', 'CMYK', 'Pantone', 'Grayscale'],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You need to quickly create a visually appealing social media graphic without extensive design software knowledge. Which of the following tools is specifically designed for ease of use and provides pre-made templates for various design needs?',
    options: ['Adobe Photoshop', 'Figma', 'Canva', 'Sketch'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are tasked with creating a large-format poster for an outdoor advertisement. What is the standard recommended resolution (DPI/PPI) for images to ensure high-quality print production?',
    options: ['72 DPI', '150 PPI', '300 DPI', '720 PPI'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'You are a UX designer for an e-commerce app. You need to create a user flow diagram for the checkout process to ensure it’s as intuitive and streamlined as possible. What should you prioritize focusing on while creating this diagram?',
    options: [
      "Aligning your design with the marketing team's preferences.",
      'Identifying and including all crucial steps in the checkout process.',
      'Making design decisions and changes at a lower fidelity before investing substantial time.',
      'Determining the total number of features your app should have.',
      'Comparing your design to the user flow and checkout process of competitor apps.',
    ],
    correct_answer: '1,2,4',
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In engaging in the Design Thinking process, which of the following best describes the "Ideate" phase?',
    options: [
      'Gathering information about user needs and problems.',
      'Defining the problem statement based on research findings.',
      'Brainstorming a wide range of creative solutions without initial judgment.',
      'Testing prototypes with users to gather feedback.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You’ve completed the wireframing phase and are now moving into prototyping. What is the main advantage of creating a low-fidelity prototype before a high-fidelity one?',
    options: [
      'It allows for early and rapid testing of core functionalities and user flows without significant investment.',
      'It showcases the final visual design and branding elements to stakeholders.',
      'It ensures perfect pixel alignment and responsive design across all devices.',
      'It is directly convertible into production-ready code by developers.',
    ],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You’re tasked with building a responsive website using WordPress. To ensure the site adapts well to different screen sizes, which aspect of WordPress theme selection is most crucial?',
    options: [
      'The number of pre-installed plugins available.',
      "The theme's color palette options.",
      "The theme's built-in responsiveness and mobile-first design principles.",
      'The ease of integrating social media feeds.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Your client wants to easily manage and update the content on their WordPress site. Which WordPress feature is best suited for user-friendly content editing?',
    options: [
      'FTP client access for file uploads.',
      'The WordPress Dashboard and its Block Editor (Gutenberg).',
      "Direct access to the website's database.",
      'Manually editing PHP files within the theme.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which of the following typography terms refers to the vertical space between lines of text?',
    options: ['Kerning', 'Tracking', 'Leading', 'Baseline Shift'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'A client wants their brand to feel energetic, passionate, and bold. Based on color theory, which color would be the most effective choice?',
    options: ['Blue', 'Green', 'Red', 'Gray'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Adobe Illustrator, which tool is best for drawing precise curves and complex shapes for a logo?',
    options: ['Pencil Tool', 'Brush Tool', 'Pen Tool', 'Eraser Tool'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Figma, what feature helps maintain consistency across screens for recurring elements?',
    options: ['Pages', 'Frames', 'Components', 'Sections'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What distinguishes Generative AI tools in design from traditional software?',
    options: [
      'They only work with vector graphics.',
      'They can create entirely new content based on prompts or existing data.',
      'They are exclusively used for photo retouching.',
      'They require manual drawing for every element.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'What would typically be included in a brand kit?',
    options: [
      'A list of recommended marketing strategies.',
      'Logo variations and usage guidelines.',
      'Defined color palettes with specific color codes.',
      'Project management timelines.',
      'Typography guidelines, including primary and secondary fonts.',
    ],
    correct_answer: '1,2,4',
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Adobe Photoshop, what would you use to isolate part of an image for editing?',
    options: [
      'The Eyedropper Tool',
      'The Text Tool',
      'Selection Tools (e.g., Marquee, Lasso, Quick Selection) and Masks.',
      'The Gradient Tool',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which file format is best for preserving transparency and crisp edges of logos?',
    options: ['JPG', 'GIF', 'PNG', 'BMP'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'When applying the principle of "Proximity" in design, what is the main goal?',
    options: [
      'To create strong contrast between elements.',
      'To ensure all elements are evenly distributed across the page.',
      'To group related items together to improve organization.',
      'To make distant objects appear closer.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are working on a multi-select UI. What’s one thing you could change to clarify how users should interact?',
    options: [
      'Add instructions at the top telling the user to select a sample.',
      'Add a call to action on each card displayed.',
      'Use radio buttons instead of cards.',
      'Remove the Continue button so users can only click on a card.',
    ],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'file-upload' as const,
    question: `Choose one of the following small design projects to complete within 15–20 minutes. Submit a screenshot of your finished work to your department lead.

**Option 1: "EcoFuture Hero Section"**
Design a homepage hero section in Figma for a nonprofit called "EcoFuture". Include headline, subheadline, CTA, and a visual background.

**Option 2: "Community Bake Sale Flyer"**
Create an A5-size or 1080x1080px flyer in Canva or Figma. Include a title, date/time/location, and one visual element.

**Option 3: "LinkUp Logo"**
Design a vector logo in Adobe Illustrator using 2–4 geometric shapes. It should be scalable and visually clean.`,
    points: 10,
    has_correct_answer: false,
  },
]


const bizzNestVideoQuestions = [
  {
    type: 'multiple-choice-single' as const,
    question: 'When developing a script for a 30-second social media ad, which element is most critical to prioritize for immediate audience engagement?',
    options: [
      'Detailed character descriptions.',
      'Complex plot development.',
      'A strong hook within the first 3-5 seconds.',
      'Extensive background music notes.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are tasked with creating a short marketing video for social media. Which of the following pre-production documents is most crucial for ensuring a consistent visual flow and efficient shooting schedule?',
    options: [
      'A comprehensive script with dialogue.',
      'A detailed storyboard or shot list.',
      'A list of required equipment.',
      'A mood board with color palettes.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What is the primary benefit of creating a storyboard before shooting a short marketing video?',
    options: [
      "Estimating the final video's budget.",
      'Getting client approval on visual sequences and narrative flow.',
      'Finalizing all script dialogue.',
      "Determining the video's distribution channels.",
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'A client asks for a "visual alignment presentation" (or "visual deck") for an upcoming video project. What is the main purpose of this document?',
    options: [
      'To provide a detailed, minute-by-minute shooting schedule.',
      'To present the final, word-for-word script.',
      'To define the visual mood, style, and aesthetic of the video.',
      'To list all required crew members and their roles.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You are planning to shoot an outdoor interview. Which lighting setup would be most appropriate?',
    options: [
      'Using only natural sunlight directly on the subject.',
      'Placing a single light behind the subject.',
      'Employing a three-point lighting setup (key, fill, and back light).',
      'Using a large floodlight pointed at the background.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What camera technique is crucial to prevent jerky motion in a pan?',
    options: [
      'Increasing the ISO setting.',
      'Widening the aperture.',
      'Using a slow, consistent pan speed with deliberate movement.',
      'Zooming in rapidly during the pan.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What is the most effective way to minimize background noise in recorded audio?',
    options: [
      "Using the camera's built-in mic.",
      'Placing the mic far from the speaker.',
      'Using an external mic (e.g., lavalier) close to the speaker.',
      'Relying solely on post-production noise reduction.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'To ensure best video quality on iPhone, which setting should be prioritized?',
    options: [
      'Keep phone in portrait mode.',
      'Use front-facing camera.',
      'Film in 4K at 30 or 24 fps.',
      'Use automatic exposure settings.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What is the primary purpose of color correction?',
    options: [
      'Add artistic filters.',
      'Drastically change the mood.',
      'Ensure color consistency and accuracy.',
      'Remove all color.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Your colleague wants a title to “ease in.” What animation curve should you use?',
    options: [
      'Accelerate from off-screen.',
      'Decelerate into place.',
      'Keep constant speed.',
      'Accelerate then decelerate.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What’s the earliest step in your Instagram reel process to promote a newsletter?',
    options: [
      'Decide on music.',
      'Select visual style.',
      'Determine the call to action.',
      'Define reel duration.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'You captured 4K but need Full HD delivery. What’s the correct export approach?',
    options: [
      'Export from 4K timeline to 1080p.',
      'Use 720p timeline.',
      'Set timeline to 1920x1080 and export Full HD.',
      'Use 1080x1920 portrait and export Full HD.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Premiere Pro, what panel removes green tint efficiently?',
    options: [
      'Lumetri Color.',
      'Warp Stabilizer.',
      'Essential Graphics.',
      'Multi-Camera.',
    ],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'For exporting social media video efficiently, which codec is best?',
    options: [
      'Highest bitrate always.',
      'Uncompressed video codec.',
      'H.264 with platform-optimized bitrate.',
      'Lowest possible resolution.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What ensures professional podcast audio consistency?',
    options: [
      'Many background music tracks.',
      'Consistent mic technique + acoustic treatment.',
      'Lots of varied sound effects.',
      'Max volume throughout.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Where should you place a subject using the Rule of Thirds?',
    options: [
      'Center of the frame.',
      'Along intersecting lines.',
      'Edge of frame.',
      'Top-left corner only.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What video codec is preferred for intermediate editing?',
    options: ['WMV', 'ProRes/DNxHR', 'WebM', 'MP3'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What’s the key pacing for TikTok/Reels content?',
    options: [
      'Fast pacing with frequent cuts.',
      'Slow and emotional pacing.',
      'Ensure all dialogue is heard.',
      'Match TV ad pacing.',
    ],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In After Effects, which feature is best for smooth motion?',
    options: [
      'Puppet Pin Tool.',
      'Content-Aware Fill.',
      'Transform + Graph Editor.',
      'Roto Brush Tool.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which Canva feature enables smooth entrance/exit animations?',
    options: [
      'Background Remover.',
      'Magic Resize.',
      'Animation features with timing controls.',
      'Brand Kit.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'file-upload' as const,
    question: `Choose one of the following video content projects. You may take up to 2 hours. Submit the deliverable to your department lead.

**Project 1: Instagram Reel – "Urban Threads" Launch**
• Create a 15–30 second Reel for a fictional clothing brand using trending audio, 2+ visual scenes, text overlays, and a CTA.

**Project 2: Storyboard & Script – Office Item Satire**
• Choose a common object and write a short (60–90 word) exaggerated script, then create a 3–5 panel storyboard and matching shot list.

**Project 3: Informational Video – Local Business**
• Simulate a 60–90 second video combining interview-style footage and b-roll for a hypothetical local business (e.g., coffee roaster, bookstore). Include 3–4 interview questions and edit the final clip with basic text overlays and background music.`,
    points: 10,
    has_correct_answer: false,
  },
]

const bizzNestMarketingQuestions = [
  {
    type: 'multiple-choice-single' as const,
    question: 'How should you decide which content formats to include in your monthly communication plan?',
    options: [
      'Research which formats are trending in the publishing industry.',
      'Test how, when, and what content the target audience wants.',
      'Research which formats are most popular on your chosen social media platform.',
      'Use the format that you have had success with previously.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which social media activity best engages a younger audience for a new drink launch?',
    options: [
      'Post a link to the website’s description of the new drink.',
      'Post videos showing how people can best enjoy the new drink.',
      'Post photos showing people enjoying the drink at parties.',
      'Post a press release about the new drink.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What should you look at to evaluate a campaign across social media platforms?',
    options: [
      'Activity inside each specific social media platform.',
      'Activity across all your social media platforms.',
      "Activity from the company's website weblogs.",
      'Activity from the social media platform and all public websites.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How should you determine post frequency in a social media plan?',
    options: [
      'Match the frequency with which your competitors post.',
      'Continue to follow your group’s usual posting routine.',
      'Test for frequency levels and post at the most responsive times.',
      'Schedule your planned posts evenly over the next month.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which social media feature is most relevant to personal branding?',
    options: [
      'Using trending hashtags on every post.',
      'Regularly sharing memes related to your industry.',
      'Consistently publishing original long-form articles or video series on LinkedIn/YouTube.',
      'Aggressively following and unfollowing other users.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which principle is most important when choosing content types for a fitness community marketing strategy?',
    options: [
      'Posting the highest quantity of content possible daily.',
      'Focusing exclusively on celebrity endorsements.',
      'Aligning content types with specific stages of the user’s journey.',
      'Only posting content that has gone viral in other industries.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which design principle is crucial for brand identity consistency?',
    options: [
      'Using a different color palette for each platform.',
      'Varying your logo for different post types.',
      'Maintaining consistency in logo, brand colors, and typography.',
      'Employing complex, busy backgrounds.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'What does Hootsuite help with?',
    options: [
      'Scheduling posts across multiple networks.',
      'Monitoring mentions and conversations.',
      'Analyzing social media performance metrics.',
      'Directly creating and editing high-fidelity video content.',
    ],
    correct_answer: '0,1,2',
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What feature should you recommend for a new Instagram business account?',
    options: [
      'Add brand-related hashtags to their bio.',
      'Switch from personal to business account.',
      'Change the Instagram username.',
      'Create Instagram story highlights.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How should you respond to a rude comment on a brand’s Instagram post?',
    options: [
      'Please remove it or we will report your account.',
      'Your language is unacceptable.',
      'Please send us a direct message so we can address your feedback.',
      'Sorry you’re upset. We’ll ignore this if you remove it.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What type of content should be most common in a monthly plan for a makeup brand?',
    options: ['Static posts', 'Carousel posts', 'Reels', 'Instagram Live'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'true-false' as const,
    question: 'Influencer campaigns must use UTM-tagged links to match visibility of paid search/email.',
    correct_answer: 'true',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How should you determine how frequently to post content in a product release plan?',
    options: [
      'Match frequency with competitors.',
      'Use the usual posting routine.',
      'Test for best frequency and responsiveness.',
      'Evenly schedule over the month.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What should you analyze to understand campaign performance across platforms?',
    options: [
      'Activity inside each platform.',
      'Activity across all your platforms.',
      'Company website weblogs.',
      'Activity across social platforms and public websites.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What is the best way to engage TikTok users with fashion content?',
    options: [
      'Dance challenge not related to shoes.',
      'Fashion-themed UGC with trending aesthetics.',
      'Funny skits without product.',
      'Slideshow of product catalog.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How should you handle negative TikTok comments about a product?',
    options: [
      'Ignore the comments.',
      'Respond with empathy and help.',
      'Delete the comments.',
      'Offer discounts in response.',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What should a new beauty brand prioritize when launching on TikTok?',
    options: [
      'Copy competitors.',
      'Use paid ads.',
      'Focus on follower count.',
      'Launch UGC challenge featuring the collection.',
    ],
    correct_answer: '3',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What technique allows a photo to appear only inside a text shape?',
    options: [
      'Grouping layers',
      'Drop shadow',
      'Clipping mask',
      'Layer opacity',
      'Eyedropper tool',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What metric is most useful for early TikTok campaign performance?',
    options: [
      'Total views and unique viewers',
      'Watch-time and completion rate',
      'Follower growth and demographics',
      'Comment and share count',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'true-false' as const,
    question: 'The red plus sign (+) indicates overflow text in a text box.',
    correct_answer: 'true',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'file-upload' as const,
    question: `Choose one of the following short marketing projects. Submit your work to your department lead.

**Option 1: Instagram Reel**
Create a 15–30 second Instagram Reel promoting a fictional clothing brand launch, using trending audio, 2+ visual scenes, and a strong CTA.

**Option 2: Content Calendar**
Build a 1-month calendar for "The Green Bean Cafe & Bookstore" with 3–4 content pillars, 3+ platforms, post types, CTAs, and KPIs.

**Option 3: Community Bake Sale Flyer**
Design a flyer (e.g., 1080x1080px) with title, time/date/location, and visual element using Canva or Figma. Focus on clear hierarchy and space usage.`,
    points: 10,
    has_correct_answer: false,
  },
]


const bizzNestWebDevQuestions = [
  {
    type: 'multiple-choice-single' as const,
    question: 'Which HTML element is used to define the main content of a document?',
    options: ['<header>', '<section>', '<main>', '<body>'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which attribute is essential for accessibility when embedding images?',
    options: ['title', 'srcset', 'alt', 'loading'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which CSS property controls the space inside an element?',
    options: ['margin', 'border', 'padding', 'gap'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which CSS rule targets .btn only on hover?',
    options: ['.btn.active { }', '.btn::after { }', '.btn:hover { }', 'button.btn { }'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'Which techniques help create responsive layouts?',
    options: [
      'Using media queries',
      'Using flexible grid/fractional units',
      'Fixed-width containers in pixels only',
      'Applying relative units like em/rem/vw',
    ],
    correct_answer: '0,1,3',
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which React Hook adds local state to a function component?',
    options: ['useRef', 'useState', 'useContext', 'useMemo'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How do you pass data from a parent to a child component in React?',
    options: ['Global variables', 'Via props', 'Modifying child state', 'Using useEffect'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Why should items in a React .map() list have a key?',
    options: [
      'To set a CSS class',
      'To help React track updates efficiently',
      'To bind events',
      'To improve SEO',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which Node.js core module enables file I/O?',
    options: ['http', 'fs', 'path', 'os'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How do you install a dev-only dependency with npm?',
    options: [
      'npm install <pkg>',
      'npm install <pkg> --save-dev',
      'npm install <pkg> -g',
      'npm add <pkg>',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which is true about async/await in Node.js?',
    options: [
      'await works outside async functions.',
      'async makes functions synchronous.',
      'await pauses inside async until resolved.',
      'async/await only works with callbacks.',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which Git command creates a new branch and switches to it?',
    options: [
      'git branch <branch>',
      'git switch <branch>',
      'git checkout -b <branch>',
      'git merge <branch>',
    ],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which file must be committed to share dependencies?',
    options: ['package-lock.json', '.env', 'package.json', '.gitignore'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'Which practices define a good Git commit message?',
    options: [
      'Use imperative mood',
      'Include unrelated changes',
      'Keep summary line under 50 characters',
      'Write message in uppercase',
    ],
    correct_answer: '0,2',
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which Git operation rewrites history to keep it linear?',
    options: [
      'git merge --no-ff',
      'git rebase',
      'git cherry-pick',
      'git revert',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which element semantically defines navigation?',
    options: ['<div>', '<nav>', '<span>', '<article>'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which box model property is NOT part of total width calculation?',
    options: ['margin', 'padding', 'border', 'width'],
    correct_answer: '0',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What does app.listen(3000) do in Express?',
    options: [
      'Defines middleware',
      'Starts server listening on port 3000',
      'Connects to database',
      'Adds a route',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which tag improves SEO with metadata?',
    options: ['<link>', '<meta>', '<script>', '<section>'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'In Flexbox, what controls spacing along the main axis?',
    options: ['align-items', 'justify-content', 'flex-wrap', 'order'],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which file tells Git to ignore certain files?',
    options: ['README.md', 'gitconfig', '.gitignore', '.gitattributes'],
    correct_answer: '2',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What’s the purpose of a package.json "build" script?',
    options: [
      'List collaborators',
      'Define npm run build',
      'Specify Node.js version',
      'Configure ESLint',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'How do you export exactly one value in modern React?',
    options: [
      'export const MyComponent = () => {}',
      'export default MyComponent;',
      'module.exports = MyComponent;',
      'exports.MyComponent = MyComponent;',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'Which command updates your branch while preserving your commits on top?',
    options: [
      'git pull --merge',
      'git pull --rebase',
      'git fetch && git reset --hard origin/main',
      'git stash',
    ],
    correct_answer: '1',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'file-upload' as const,
    question: `Choose one of the following web dev projects. You have 15–20 minutes. Submit the result to your department lead.

**Project 1 – Static Web Page (HTML/CSS):**
Build a responsive portfolio page with your name, about section, list of 3 skills, and a button linking to GitHub.

**Project 2 – React To‑Do Component:**
Create a React to-do component allowing add/view/complete tasks using useState and functional components.

**Project 3 – Node.js/Express API Stub:**
Create a simple REST API with GET/POST routes for tasks using in-memory data and express.json() middleware.`,
    points: 10,
    has_correct_answer: false,
  },
]


const seedDatabase = async () => {
  try {
    const quizId1 = await createQuiz(
      'bizzNEST – Design Technical Skills Assessment',
      'A mixed-format design quiz assessing technical design knowledge and visual communication skills.',
      bizzNestDesignQuestions
    )

    const quizId2 = await createQuiz(
      'bizzNEST – Video Technical Skills Assessment',
      'A mixed-format video quiz assessing technical video knowledge and visual communication skills.',
      bizzNestVideoQuestions
    )

    const quizId3 = await createQuiz(
      'bizzNEST – Marketing Technical Skills Assessment',
      'A mixed-format marketing quiz assessing technical marketing knowledge and visual communication skills.',
      bizzNestMarketingQuestions
    )

    const quizId4 = await createQuiz(
      'bizzNEST – Web Development Technical Skills Assessment',
      'A mixed-format web development quiz assessing technical web development knowledge and visual communication skills.',
      bizzNestWebDevQuestions
    )

    console.log(`Created bizzNEST Design quiz with ID: ${quizId1}`)
    console.log(`Created bizzNEST Video quiz with ID: ${quizId2}`)
    console.log(`Created bizzNEST Marketing quiz with ID: ${quizId3}`)
    console.log(`Created bizzNEST Web Development quiz with ID: ${quizId4}`)
    
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()

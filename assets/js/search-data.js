// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-ai4science-blog",
          title: "AI4Science Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/sci_blog/";
          },
        },{id: "nav-life",
          title: "Life",
          description: "List of my efforts to figure out my meaning of life.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/big_life_moments/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Teaching experience at UC Berkeley.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "post-from-mle-to-neyman-pearson-to-reward-models",
        
          title: "From MLE to Neyman-Pearson to Reward Models",
        
        description: "A broad roadmap of statistical inference, inspired by Data 145, and a short bridge to modern reward-based AI.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/from-mle-to-neyman-pearson-to-reward-models/";
          
        },
      },{id: "post-explainable-ai-xai-and-model-interpretability-shap-integrated-gradients-and-sparse-autoencoders",
        
          title: "Explainable AI (XAI) and Model Interpretability (SHAP, Integrated Gradients, and Sparse Autoencoders)",
        
        description: "A future-me-friendly toolbox of interpretability methods: feature attribution (Shapley/SHAP, Integrated Gradients), perturbation tests, and representation-level methods like Sparse Autoencoders.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/interp-post/";
          
        },
      },{id: "post-diffusion-language-models-deep-dive-part-1-method",
        
          title: "Diffusion Language Models Deep Dive (Part 1: Method)",
        
        description: "This post explains general development of diffusion language models (DLMs), including Discrete Diffusion, and Simple and Effective Masked Diffusion Language Models.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/dlm-post-part1/";
          
        },
      },{id: "post-minimum-math-review-for-diffusion-language-models",
        
          title: "Minimum Math Review for Diffusion Language Models",
        
        description: "Diffusion Objective, Variational Inference, and KL",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/diffusion-review/";
          
        },
      },{id: "post-more-on-parallelism",
        
          title: "More on Parallelism",
        
        description: "More on Sharding and Parallelism",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/sharding-post/";
          
        },
      },{id: "post-transformer-scaling-and-efficiency",
        
          title: "Transformer, Scaling, and Efficiency",
        
        description: "Summary Notes on Catching Up",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/llm-eff-post/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/winterrykim", "_blank");
        },
      },{
        id: 'social-kaggle',
        title: 'Kaggle',
        section: 'Socials',
        handler: () => {
          window.open("https://www.kaggle.com/terrykim1211", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/terry-taehan-kim", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=DSGho3IAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];

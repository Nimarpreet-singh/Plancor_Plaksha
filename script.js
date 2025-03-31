// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false
    });
    
    // Initialize model loading
    loadModel();
  });
  
  // Global variables
  const modelBaseURL = "https://teachablemachine.withgoogle.com/models/V_OaopnMk/";
  let model, maxPredictions;
  let isResultsActive = false;
  
  // Sample product list – each product has an image, price, caption (optional) and a list of classes (one is a color)
const products = [
  // Original products
  { id: 1, name: "Decoration sticks", price: "₹180", image: "https://i.postimg.cc/52d2x6dV/red11.png", classes: ["red", "vase"], description: "Handcrafted from upcycled rice husks with a beautiful natural finish." },
  { id: 2, name: "Blue dry flower sticks", price: "₹200", image: "https://i.postimg.cc/c4fYQKSD/blu.png", classes: ["blue", "lamp"], description: "Elegant sticks made from dry flowers." },
  { id: 3, name: "White flower pot boquet", price: "₹250", image: "https://i.postimg.cc/9FpM7Gdt/wh.png", classes: ["white", "cushion"], description: "A beautiful white vase boquet to elevate your space." },
  { id: 4, name: "Dried leaves sticks", price: "₹120", image: "https://i.postimg.cc/yNxJZ8Bx/lea.png", classes: ["red", "art"], description: "Decorative sticks made with dried leaves in red color." },
  { id: 5, name: "Eco-friendly boquet", price: "₹450", image: "https://i.postimg.cc/T11JYtbp/10.png", classes: ["blue", "cushion"], description: "A beautiful boquet in pastel colors best for co-operate gifting." },
  { id: 6, name: "White bouquet", price: "₹350", image: "https://i.postimg.cc/LXVrF2Yk/wwwww.png", classes: ["white", "lamp"], description: "Bouquet with various variety of sticks including wheat sticks." },
  { id: 7, name: "Christmas tree", price: "₹90", image: "https://i.postimg.cc/9MTyDQtT/cornn.png", classes: ["red", "chair"], description: "Christmas tree made from corn husk." },
  { id: 8, name: "Blue vase", price: "₹290", image: "https://i.postimg.cc/tRNVwfrX/bv.png", classes: ["blue", "rug"], description: "A beautiful vase made from sugarcane bagasse." },
  { id: 9, name: "Sustainable home decor", price: "₹420", image: "https://i.postimg.cc/FKv4MPC4/whhhhhhiiiiii.png", classes: ["white", "table"], description: "A best and sustainable option for your house.." },
  
  // New products for additional colors
  { id: 10, name: "Green and yellow sticks", price: "₹180", image: "https://i.postimg.cc/28q7sXmt/15.png", classes: ["lemon", "basket"], description: "A perfect blend of colours." },
  { id: 11, name: "Orange decorative pieces", price: "₹340", image: "https://i.postimg.cc/76yXj85k/orange.png", classes: ["orange", "art"], description: "A perfect option for your place." },
  { id: 12, name: "Pink bouquet", price: "₹450", image: "https://i.postimg.cc/mgpCs3Jg/21.png", classes: ["pink", "bowl"], description: "A perfect genz piece of gifting your loved ones." },
  { id: 13, name: "Lavender flower sticks", price: "₹450", image: "https://i.postimg.cc/442V9RXx/purpl.png", classes: ["lavender", "decor"], description: "Aromatic vibes with the colours of lavender." },
  { id: 14, name: "Light blue bouquet", price: "₹450", image: " https://i.postimg.cc/XqDbC4gK/llllbbbbb.png", classes: ["light blue", "textile"], description: "Best gifting option for you and your loved ones." },
  { id: 15, name: "Pastel green bouquet ", price: "₹450", image: "https://i.postimg.cc/NjF2p9Fq/27.png", classes: ["pastel green", "planter"], description: "Explore our pastel colour palet of decors." },
  // { id: 15, name: "Pastel Green Bamboo Planter", price: "₹", image: "https://i.postimg.cc/NjF2p9Fq/27.png", classes: ["pastel green", "planter"], description: "Eco-friendly planter made from bamboo fiber with subtle green finish." },
  { id: 16, name: "Green and yellow decor", price: "₹180", image: "https://i.postimg.cc/28q7sXmt/15.png", classes: ["green", "tableware"], description: "Biodegradable plant sticks to decorate your places." },
  { id: 17, name: "Pastel yellow decorations", price: "₹320", image: "https://i.postimg.cc/YCR7w65L/py.png", classes: ["pastel yellow", "decor"], description: "Decorative sticks with round flowers on top." },
  { id: 18, name: "Peach decoration", price: "₹350", image: "https://i.postimg.cc/G2GyGW24/23.png", classes: ["peach", "lighting"], description: "Peach color decoration with variety of flowers and eco-friendly sticks." },
  { id: 19, name: "Light green coloured sticks", price: "₹280", image: "https://i.postimg.cc/VvF0HXX1/25.png", classes: ["sea green", "candle"], description: "Bunch of light green coloured sticks." },
  { id: 20, name: "Brown home decor", price: "₹450", image: "https://i.postimg.cc/pXTdHNHK/35.png", classes: ["brown", "furniture"], description: "A variety of brown decorations." },
  { id: 21, name: "Golden sustainable decor", price: "₹320", image: "https://i.postimg.cc/dVHfB5M6/goldennnn.png", classes: ["golden", "decor"], description: "Decorative golden flower pot sticks." },
  { id: 22, name: "Silver eco friendly sticks ", price: "₹280", image: "https://i.postimg.cc/h4L3wDWf/silverrrr.png", classes: ["silver", "art"], description: "Shimmering decorative flower pot sticks." }
];
  
  // ===== Scroll Effects =====
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Navbar effect
    const navbar = document.querySelector('.navbar');
    if (scrollPosition > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for story section
    const storySection = document.querySelector('.story-section');
    if (storySection) {
      const storyTop = storySection.offsetTop;
      const storyHeight = storySection.offsetHeight;
      
      if (scrollPosition >= storyTop - window.innerHeight / 2 && 
          scrollPosition <= storyTop + storyHeight) {
        const parallaxElements = document.querySelectorAll('[data-speed]');
        
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-speed'));
          const yPos = -(scrollPosition - storyTop) * speed;
          element.style.transform = `translateY(${yPos}px)`;
        });
      }
    }
    // Create Earth SVG element
function createEarthElement() {
  const earthSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  earthSVG.setAttribute("viewBox", "0 0 200 200");
  earthSVG.setAttribute("class", "earth-globe");
  earthSVG.style.width = "100%";
  earthSVG.style.height = "100%";
  
  // Create Earth circle
  const earthCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  earthCircle.setAttribute("cx", "100");
  earthCircle.setAttribute("cy", "100");
  earthCircle.setAttribute("r", "90");
  earthCircle.setAttribute("fill", "#1E88E5");
  
  // Create continents
  const continents = document.createElementNS("http://www.w3.org/2000/svg", "path");
  continents.setAttribute("d", "M50,40 Q70,30 90,40 T130,50 T170,40 T120,80 T90,120 T40,100 T70,60 Z");
  continents.setAttribute("fill", "#4CAF50");
  
  // Create more continents
  const continents2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  continents2.setAttribute("d", "M130,130 Q150,120 160,140 T130,160 T100,140 Z");
  continents2.setAttribute("fill", "#4CAF50");
  
  // Create more continents
  const continents3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  continents3.setAttribute("d", "M40,130 Q60,140 40,160 T60,170 T80,150 Z");
  continents3.setAttribute("fill", "#4CAF50");
  
  earthSVG.appendChild(earthCircle);
  earthSVG.appendChild(continents);
  earthSVG.appendChild(continents2);
  earthSVG.appendChild(continents3);
  
  return earthSVG;
}
    // Earth rotation effect
const colorSection = document.querySelector('.color-match-section');
if (colorSection) {
  const colorTop = colorSection.offsetTop;
  const colorHeight = colorSection.offsetHeight;
  
  if (scrollPosition >= colorTop - window.innerHeight / 2 && 
      scrollPosition <= colorTop + colorHeight) {
    const colorWheel = document.querySelector('.color-wheel');
    if (colorWheel) {
      // Replace color wheel with Earth if not already replaced
      if (!colorWheel.querySelector('.earth-globe')) {
        colorWheel.innerHTML = '';
        colorWheel.appendChild(createEarthElement());
      }
      
      const rotationDegree = (scrollPosition - (colorTop - window.innerHeight / 2)) / 5;
      colorWheel.style.transform = `rotate(${rotationDegree}deg)`;
    }
  }
}
  });
  
  // ===== Mobile Menu Toggle =====
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        const navIcons = document.querySelector('.nav-icons');
        
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
          navLinks.style.display = 'flex';
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '100%';
          navLinks.style.left = '0';
          navLinks.style.width = '100%';
          navLinks.style.backgroundColor = 'white';
          navLinks.style.padding = '20px';
          navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
          
          navIcons.style.display = 'flex';
          navIcons.style.justifyContent = 'center';
          navIcons.style.padding = '20px';
          navIcons.style.backgroundColor = 'white';
          navIcons.style.borderTop = '1px solid #eee';
        } else {
          navLinks.style.display = '';
          navLinks.style.flexDirection = '';
          navLinks.style.position = '';
          navLinks.style.top = '';
          navLinks.style.left = '';
          navLinks.style.width = '';
          navLinks.style.backgroundColor = '';
          navLinks.style.padding = '';
          navLinks.style.boxShadow = '';
          
          navIcons.style.display = '';
          navIcons.style.justifyContent = '';
          navIcons.style.padding = '';
          navIcons.style.backgroundColor = '';
          navIcons.style.borderTop = '';
        }
      });
    }
  });
  
  // ===== Trigger File Upload =====
  document.addEventListener('DOMContentLoaded', function() {
    const triggerUpload = document.getElementById('triggerUpload');
    if (triggerUpload) {
      triggerUpload.addEventListener('click', function() {
        document.getElementById('imageInput').click();
      });
    }
    
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', function() {
        document.getElementById('imageInput').click();
      });
    }
    
    // ===== Image Upload Event =====
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
      imageInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          showResultsSection();
          document.getElementById('imageInputResults').files = this.files;
          document.getElementById('getRecommendationsBtn').click();
        }
      });
    }
    
    const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
    if (getRecommendationsBtn) {
      getRecommendationsBtn.addEventListener('click', predictImage);
    }
  });
  
  // ===== Show Results Section =====
  function showResultsSection() {
    if (isResultsActive) return;
    
    // Hide animation sections with smooth transition
    const sections = [
      document.getElementById('heroSection'),
      document.getElementById('storySection'),
      document.getElementById('colorMatchSection'),
      document.getElementById('benefitsSection')
    ];
    
    sections.forEach(section => {
      if (section) {
        section.classList.add('transition-fade', 'hidden');
        setTimeout(() => {
          section.style.display = 'none';
        }, 500);
      }
    });
    
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Force reflow
    void resultsSection.offsetWidth;
    
    resultsSection.classList.add('transition-fade', 'visible');
    resultsSection.classList.add('active');
    
    isResultsActive = true;
    
    // Scroll to results section
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  // ===== Load Teachable Machine Model =====
  async function loadModel() {
    try {
      const modelURL = modelBaseURL + "model.json";
      const metadataURL = modelBaseURL + "metadata.json";
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
      console.log("Model loaded successfully.");
    } catch (error) {
      console.error("Error loading model:", error);
      // Create a fallback model for demo purposes
      createFallbackModel();
    }
  }
  
  // Fallback model for demo purposes
  function createFallbackModel() {
    console.log("Creating fallback model for demo");
    model = {
      predict: async function(img) {
        // Simulate model prediction with random values
        const colors = ["red", "blue", "white"];
        const predictions = colors.map(color => {
          return {
            className: color,
            probability: Math.random()
          };
        });
        
        // Sort predictions by probability for more realistic results
        predictions.sort((a, b) => b.probability - a.probability);
        
        // Normalize probabilities to sum to 1
        const sum = predictions.reduce((acc, pred) => acc + pred.probability, 0);
        predictions.forEach(pred => pred.probability = pred.probability / sum);
        
        return predictions;
      },
      getTotalClasses: function() {
        return 3;
      }
    };
    maxPredictions = 3;
  }
  
  // ===== Predict Image =====
  async function predictImage() {
    const fileInput = document.getElementById('imageInputResults');
    if (fileInput.files.length === 0) {
      alert("Please select an image.");
      return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      const img = new Image();
      img.onload = async function() {
        // Create a canvas for the model prediction
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 224;
        const height = 224;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          const predictions = await model.predict(canvas);
          // Sort predictions by probability (highest first)
          const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);
          
          // Display results
          displayResults(sortedPredictions, event.target.result);
        } catch (error) {
          console.error("Error predicting image:", error);
          // Use fallback for demo
          const fallbackPredictions = [
            { className: "red", probability: 0.5 },
            { className: "blue", probability: 0.3 },
            { className: "white", probability: 0.2 }
          ];
          displayResults(fallbackPredictions, event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  // ===== Display Results =====
  function displayResults(predictions, imageDataURL) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    // 1. Image Preview
    const previewSection = document.createElement('div');
    previewSection.className = 'preview-section';
    
    const previewImage = document.createElement('img');
    previewImage.src = imageDataURL;
    previewImage.alt = 'Uploaded Image';
    previewImage.style.maxWidth = '300px';
    previewImage.style.borderRadius = '10px';
    previewImage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    
    previewSection.appendChild(previewImage);
    resultsDiv.appendChild(previewSection);
    
    // // 2. Prediction Results
    // const predictionSection = document.createElement('div');
    // predictionSection.className = 'prediction-section';
    // predictionSection.innerHTML = `
    //   <h2>Color Analysis</h2>
    //   <p>We've analyzed your image and found these dominant colors:</p>
    //   <div class="color-results">
    //     ${predictions.map(pred => `
    //       <div class="color-result">
    //         <div class="color-swatch" style="background-color: ${pred.className}"></div>
    //         <div class="color-info">
    //           <span class="color-name">${pred.className}</span>
    //           <span class="color-percentage">${Math.round(pred.probability * 100)}%</span>
    //         </div>
    //       </div>
    //     `).join('')}
    //   </div>
    // `;
    // resultsDiv.appendChild(predictionSection);
    

//     // 3. Create a summary element for top 3 color matches
// const topMatchesSummary = document.createElement('div');
// topMatchesSummary.className = 'top-matches-summary';
// topMatchesSummary.innerHTML = `
//   <h2>Top Color Matches</h2>
//   <div class="top-matches-container">
//     ${predictions.slice(0, 3).map((pred, index) => `
//       <div class="top-match-item ${index === 0 ? 'primary-match' : ''}">
//         <div class="match-color-swatch" style="background-color: ${pred.className}"></div>
//         <div class="match-details">
//           <span class="match-color-name">${pred.className.charAt(0).toUpperCase() + pred.className.slice(1)}</span>
//           <div class="match-percentage-bar">
//             <div class="percentage-fill" style="width: ${Math.round(pred.probability * 100)}%; background-color: ${pred.className}"></div>
//           </div>
//           <span class="match-percentage-text">${Math.round(pred.probability * 100)}% match</span>
//         </div>
//       </div>
//     `).join('')}
//   </div>
// `;
// resultsDiv.appendChild(topMatchesSummary);

// 4. Product Recommendations by Color
// Get top 3 predictions
const topPredictions = predictions.slice(0, 3);

topPredictions.forEach(prediction => {
  const color = prediction.className.toLowerCase();  // Convert to lowercase
  const percentage = Math.round(prediction.probability * 100);
  
  // Filter products by color (case-insensitive)
  const colorProducts = products.filter(product => 
    product.classes.some(cls => cls.toLowerCase() === color)
  );
  
  if (colorProducts.length > 0) {
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.innerHTML = `
      <h2 class="category-header">${color.charAt(0).toUpperCase() + color.slice(1)} Products (${percentage}% match)</h2>
      <div class="product-container">
        ${colorProducts.map(product => `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p>${product.description}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        `).join('')}
      </div>
    `;
    resultsDiv.appendChild(categorySection);
  }
});
    
// // 3. Product Recommendations by Color
// // Get top 3 predictions
// const topPredictions = predictions.slice(0, 3);

// topPredictions.forEach(prediction => {
//   const color = prediction.className.toLowerCase();  // Convert to lowercase
//   const percentage = Math.round(prediction.probability * 100);
  
//   // Filter products by color (case-insensitive)
//   const colorProducts = products.filter(product => 
//     product.classes.some(cls => cls.toLowerCase() === color)
//   );
  
//   if (colorProducts.length > 0) {
//     const categorySection = document.createElement('div');
//     categorySection.className = 'category-section';
//     categorySection.innerHTML = `
//       <h2 class="category-header">${color.charAt(0).toUpperCase() + color.slice(1)} Products (${percentage}% match)</h2>
//       <div class="product-container">
//         ${colorProducts.map(product => `
//           <div class="product-card">
//             <img src="${product.image}" alt="${product.name}">
//             <h3>${product.name}</h3>
//             <p class="price">${product.price}</p>
//             <p>${product.description}</p>
//             <button class="add-to-cart-btn">Add to Cart</button>
//           </div>
//         `).join('')}
//       </div>
//     `;
//     resultsDiv.appendChild(categorySection);
//   }
// });
    
    // Apply animations to results
    setTimeout(() => {
        const elements = resultsDiv.querySelectorAll('.preview-section, .prediction-section, .category-section');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            // Force reflow
            void element.offsetWidth;
            
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }, index * 200);
        });
      }, 100);
      
    }
      
      // Back to Home button
      function backToHome() {
        // Hide results section
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('visible');
        resultsSection.classList.add('hidden');
        
        setTimeout(() => {
          resultsSection.style.display = 'none';
          
          // Show other sections
          const sections = [
            document.getElementById('heroSection'),
            document.getElementById('storySection'),
            document.getElementById('colorMatchSection'),
            document.getElementById('benefitsSection')
          ];
          
          sections.forEach(section => {
            if (section) {
              section.style.display = 'flex';
              section.classList.remove('hidden');
              
              // Force reflow
              void section.offsetWidth;
              
              section.classList.add('visible');
            }
          });
          
          isResultsActive = false;
          
          // Scroll to top
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 500);
      }
      
      // ===== Add Back Button to Results Section =====
      document.addEventListener('DOMContentLoaded', function() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
          const backButton = document.createElement('button');
          backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Home';
          backButton.className = 'back-button';
          backButton.style.position = 'absolute';
          backButton.style.top = '20px';
          backButton.style.left = '20px';
          backButton.style.padding = '10px 15px';
          backButton.style.backgroundColor = 'var(--primary-color)';
          backButton.style.color = 'white';
          backButton.style.border = 'none';
          backButton.style.borderRadius = '30px';
          backButton.style.cursor = 'pointer';
          backButton.style.fontWeight = '600';
          backButton.style.boxShadow = 'var(--shadow)';
          backButton.style.transition = 'var(--transition)';
          
          backButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'var(--primary-dark)';
            this.style.transform = 'translateY(-2px)';
          });
          
          backButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.transform = 'translateY(0)';
          });
          
          backButton.addEventListener('click', backToHome);
          
          // Add the button to the results section
          resultsSection.style.position = 'relative';
          resultsSection.prepend(backButton);
        }
      });
      
      // ===== Add Pulse Animation for Cart =====
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(styleElement);
      
      // ===== Add Smooth Scrolling for Navigation Links =====
      document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
              e.preventDefault();
              const targetId = href.substring(1);
              const targetElement = document.getElementById(targetId);
              
              if (targetElement) {
                targetElement.scrollIntoView({
                  behavior: 'smooth'
                });
                
                // Add CSS variables for theme if they don't exist
const style = document.createElement('style');
style.textContent = `
  :root {
    --primary-color: #4CAF50;
    --primary-dark: #2E7D32;
    --text-color: #333;
    --background-color: #fff;
    --card-background: #fff;
    --shadow: 0 4px 6px rgba(0,0,0,0.1);
    --transition: all 0.3s ease;
  }
  
  [data-theme='dark'] {
    --primary-color: #4CAF50;
    --primary-dark: #2E7D32;
    --text-color: #f0f0f0;
    --background-color: #121212;
    --card-background: #1e1e1e;
    --shadow: 0 4px 6px rgba(0,0,0,0.3);
  }
  
  body {
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .product-card, .modal-content, .search-overlay {
    background-color: var(--card-background);
    color: var(--text-color);
  }
`;
document.head.appendChild(style);
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
              }
            }
          });
        });
      });
      
      // ===== Add Scroll-triggered Animations =====
      window.addEventListener('scroll', function() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        animatedElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const elementBottom = element.getBoundingClientRect().bottom;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.classList.add('aos-animate');
          }
        });
      });
      
      // Add keyboard support for accessibility
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isResultsActive) {
          backToHome();
        }
      });
      
      // Initialize tooltips for product cards
      document.addEventListener('DOMContentLoaded', function() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
          card.setAttribute('title', 'Click to view details');
          
          card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart-btn')) {
              // Show product details modal
              const productName = this.querySelector('h3').textContent;
              const productPrice = this.querySelector('.price').textContent;
              const productDescription = this.querySelector('p').textContent;
              const productImage = this.querySelector('img').src;
              
              showProductModal(productName, productPrice, productDescription, productImage);
            }
          });
        });
      });
      
      // Product modal functionality
      function showProductModal(name, price, description, image) {
        // Create modal container
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '2000';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.transition = 'opacity 0.3s ease';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '10px';
        modalContent.style.maxWidth = '800px';
        modalContent.style.width = '90%';
        modalContent.style.display = 'flex';
        modalContent.style.flexDirection = 'column';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.overflow = 'hidden';
        modalContent.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        modalContent.style.transform = 'translateY(20px)';
        modalContent.style.transition = 'transform 0.3s ease';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.padding = '20px';
        modalHeader.style.borderBottom = '1px solid #eee';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = name;
        modalTitle.style.margin = '0';
        modalTitle.style.fontSize = '1.8rem';
        modalTitle.style.color = 'var(--primary-color)';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '1.8rem';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'var(--text-color)';
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.style.padding = '20px';
        modalBody.style.display = 'flex';
        modalBody.style.flexDirection = 'column';
        modalBody.style.overflow = 'auto';
        
        const modalImage = document.createElement('img');
        modalImage.src = image;
        modalImage.alt = name;
        modalImage.style.width = '100%';
        modalImage.style.height = 'auto';
        modalImage.style.borderRadius = '5px';
        modalImage.style.marginBottom = '20px';
        
        const modalPrice = document.createElement('h3');
        modalPrice.textContent = price;
        modalPrice.style.fontSize = '1.5rem';
        modalPrice.style.color = 'var(--primary-color)';
        modalPrice.style.marginBottom = '15px';
        
        const modalDescription = document.createElement('p');
        modalDescription.textContent = description;
        modalDescription.style.lineHeight = '1.6';
        modalDescription.style.marginBottom = '20px';
        
        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.padding = '20px';
        modalFooter.style.borderTop = '1px solid #eee';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'flex-end';
        modalFooter.style.gap = '10px';
        
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.style.padding = '12px 25px';
        addToCartButton.style.backgroundColor = 'var(--primary-color)';
        addToCartButton.style.color = 'white';
        addToCartButton.style.border = 'none';
        addToCartButton.style.borderRadius = '5px';
        addToCartButton.style.fontWeight = '600';
        addToCartButton.style.cursor = 'pointer';
        
        modalBody.appendChild(modalImage);
        modalBody.appendChild(modalPrice);
        modalBody.appendChild(modalDescription);
        
        modalFooter.appendChild(addToCartButton);
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Animation
        setTimeout(() => {
          modalOverlay.style.opacity = '1';
          modalContent.style.transform = 'translateY(0)';
        }, 10);
        
        // Close modal functionality
        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
          if (e.target === modalOverlay) {
            closeModal();
          }
        });
        
        // Add to cart functionality
        addToCartButton.addEventListener('click', function() {
          this.textContent = 'Added to Cart';
          this.style.backgroundColor = '#4CAF50';
          this.disabled = true;
          
          // Update cart count
          const cartIcon = document.querySelector('.nav-icons a:nth-child(2)');
          if (cartIcon) {
            const cartBadge = cartIcon.querySelector('.cart-badge') || document.createElement('span');
            cartBadge.className = 'cart-badge';
            
            const currentCount = cartBadge.textContent ? parseInt(cartBadge.textContent) : 0;
            cartBadge.textContent = currentCount + 1;
            
            cartBadge.style.position = 'absolute';
            cartBadge.style.top = '-10px';
            cartBadge.style.right = '-10px';
            cartBadge.style.backgroundColor = 'var(--primary-color)';
            cartBadge.style.color = 'white';
            cartBadge.style.borderRadius = '50%';
            cartBadge.style.width = '20px';
            cartBadge.style.height = '20px';
            cartBadge.style.display = 'flex';
            cartBadge.style.justifyContent = 'center';
            cartBadge.style.alignItems = 'center';
            cartBadge.style.fontSize = '12px';
            
            if (!cartIcon.querySelector('.cart-badge')) {
              cartIcon.style.position = 'relative';
              cartIcon.appendChild(cartBadge);
            }
            
            // Animate cart icon
            cartIcon.style.animation = 'pulse 0.5s';
            setTimeout(() => {
              cartIcon.style.animation = '';
            }, 500);
          }
          
          // Close modal after 2 seconds
          setTimeout(() => {
            closeModal();
          }, 2000);
        });
        
        function closeModal() {
          modalOverlay.style.opacity = '0';
          modalContent.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            document.body.removeChild(modalOverlay);
          }, 300);
        }
        
        // Keyboard support for modal
        document.addEventListener('keydown', function(event) {
          if (event.key === 'Escape') {
            closeModal();
          }
        });
      }
      
      // // Initialize theme toggle
      // document.addEventListener('DOMContentLoaded', function() {
      //   // Check for saved theme preference
      //   const savedTheme = localStorage.getItem('theme');
      //   if (savedTheme) {
      //     document.documentElement.setAttribute('data-theme', savedTheme);
      //   }
        
      //   // Add theme toggle button to navbar if it doesn't exist
      //   const navIcons = document.querySelector('.nav-icons');
      //   if (navIcons && !document.querySelector('.theme-toggle')) {
      //     const themeToggle = document.createElement('a');
      //     themeToggle.href = '#';
      //     themeToggle.className = 'theme-toggle';
      //     themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      //     themeToggle.setAttribute('title', 'Toggle dark mode');
          
      //     themeToggle.addEventListener('click', function(e) {
      //       e.preventDefault();
      //       const currentTheme = document.documentElement.getAttribute('data-theme');
      //       const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
      //       document.documentElement.setAttribute('data-theme', newTheme);
      //       localStorage.setItem('theme', newTheme);
            
      //       // Update icon
      //       this.innerHTML = newTheme === 'dark' ? 
      //         '<i class="fas fa-sun"></i>' : 
      //         '<i class="fas fa-moon"></i>';
      //     });
          
      //     navIcons.appendChild(themeToggle);
      //   }
      // });
      
      // Add preloading for images to improve performance
      document.addEventListener('DOMContentLoaded', function() {
        // Preload product images
        products.forEach(product => {
          const img = new Image();
          img.src = product.image;
        });
      });
      
      // Add wishlist functionality
      function addToWishlist(productId) {
        // Get existing wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if product is already in wishlist
        if (!wishlist.includes(productId)) {
          wishlist.push(productId);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          
          // Show success message
          showToast('Product added to wishlist!');
        } else {
          showToast('Product already in wishlist!');
        }
      }
      
      // Toast notification system
      function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        toast.style.color = 'white';
        toast.style.borderRadius = '4px';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.zIndex = '2000';
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
          toast.style.transform = 'translateY(0)';
          toast.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
          toast.style.transform = 'translateY(20px)';
          toast.style.opacity = '0';
          
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
      }
      
      // Add performance optimizations
      document.addEventListener('DOMContentLoaded', function() {
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute('data-src');
              }
              observer.unobserve(lazyImage);
            }
          });
        }, { rootMargin: '200px' });
        
        // Apply to all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
          observer.observe(img);
        });
        
       // Debounced resize handler for animations
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate any size-dependent animations
    if (document.querySelector('.color-wheel')) {
      const colorWheel = document.querySelector('.color-wheel');
      // Make sure Earth is in the wheel
      if (!colorWheel.querySelector('.earth-globe')) {
        colorWheel.innerHTML = '';
        colorWheel.appendChild(createEarthElement());
      }
      colorWheel.style.transform = 'rotate(0deg)';
    }
  }, 250);
});
        });
      
      // Add search functionality
      document.addEventListener('DOMContentLoaded', function() {
        const searchIcon = document.querySelector('.nav-icons a:first-child');
        
        if (searchIcon) {
          searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.style.position = 'fixed';
            searchOverlay.style.top = '0';
            searchOverlay.style.left = '0';
            searchOverlay.style.width = '100%';
            searchOverlay.style.height = '100%';
            searchOverlay.style.backgroundColor = 'rgba(255,255,255,0.97)';
            searchOverlay.style.zIndex = '2000';
            searchOverlay.style.display = 'flex';
            searchOverlay.style.justifyContent = 'center';
            searchOverlay.style.alignItems = 'center';
            searchOverlay.style.flexDirection = 'column';
            searchOverlay.style.opacity = '0';
            searchOverlay.style.transition = 'opacity 0.3s ease';
            
            // Create search form
            const searchForm = document.createElement('div');
            searchForm.className = 'search-form';
            searchForm.style.width = '80%';
            searchForm.style.maxWidth = '600px';
            
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search for products...';
            searchInput.style.width = '100%';
            searchInput.style.padding = '15px 20px';
            searchInput.style.fontSize = '18px';
            searchInput.style.border = 'none';
            searchInput.style.borderBottom = '2px solid var(--primary-color)';
            searchInput.style.background = 'transparent';
            searchInput.style.outline = 'none';
            
            const closeSearch = document.createElement('button');
            closeSearch.innerHTML = '&times;';
            closeSearch.style.position = 'absolute';
            closeSearch.style.top = '20px';
            closeSearch.style.right = '20px';
            closeSearch.style.background = 'none';
            closeSearch.style.border = 'none';
            closeSearch.style.fontSize = '30px';
            closeSearch.style.cursor = 'pointer';
            
            searchForm.appendChild(searchInput);
            searchOverlay.appendChild(searchForm);
            searchOverlay.appendChild(closeSearch);
            document.body.appendChild(searchOverlay);
            
            // Animate in
            setTimeout(() => {
              searchOverlay.style.opacity = '1';
              searchInput.focus();
            }, 10);
            
            // Close functionality
            closeSearch.addEventListener('click', function() {
              searchOverlay.style.opacity = '0';
              setTimeout(() => {
                document.body.removeChild(searchOverlay);
              }, 300);
            });
            
            // Search functionality
            searchInput.addEventListener('keyup', function(e) {
              if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length < 2) return;
                
                // Filter products
                const filteredProducts = products.filter(product => 
                  product.name.toLowerCase().includes(searchTerm) || 
                  product.description.toLowerCase().includes(searchTerm) ||
                  product.classes.some(cls => cls.toLowerCase().includes(searchTerm))
                );
                
                // Display results
                let resultsHTML = '';
                
                if (filteredProducts.length > 0) {
                  resultsHTML += '<div class="search-results">';
                  filteredProducts.forEach(product => {
                    resultsHTML += `
                      <div class="search-result-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="search-result-info">
                          <h3>${product.name}</h3>
                          <p>${product.price}</p>
                        </div>
                      </div>
                    `;
                  });
                  resultsHTML += '</div>';
                } else {
                  resultsHTML = '<p class="no-results">No products found. Try a different search term.</p>';
                }
                
                // Remove existing results
                const existingResults = searchOverlay.querySelector('.search-results');
                if (existingResults) {
                  searchOverlay.removeChild(existingResults);
                }
                
                const existingNoResults = searchOverlay.querySelector('.no-results');
                if (existingNoResults) {
                  searchOverlay.removeChild(existingNoResults);
                }
                
                // Add new results
                searchForm.insertAdjacentHTML('afterend', resultsHTML);
                
                // Style the results
                const searchResults = searchOverlay.querySelector('.search-results');
                if (searchResults) {
                  searchResults.style.width = '80%';
                  searchResults.style.maxWidth = '600px';
                  searchResults.style.marginTop = '20px';
                  searchResults.style.maxHeight = '60vh';
                  searchResults.style.overflowY = 'auto';
                  
                  const searchResultItems = searchResults.querySelectorAll('.search-result-item');
                  searchResultItems.forEach(item => {
                    item.style.display = 'flex';
                    item.style.alignItems = 'center';
                    item.style.padding = '10px';
                    item.style.marginBottom = '10px';
                    item.style.borderRadius = '5px';
                    item.style.transition = 'background-color 0.2s ease';
                    item.style.cursor = 'pointer';
                    
                    item.addEventListener('mouseover', function() {
                      this.style.backgroundColor = '#f5f5f5';
                    });
                    
                    item.addEventListener('mouseout', function() {
                      this.style.backgroundColor = 'transparent';
                    });
                    
                    item.addEventListener('click', function() {
                      const productName = this.querySelector('h3').textContent;
                      const product = products.find(p => p.name === productName);
                      
                      if (product) {
                        // Close search overlay
                        searchOverlay.style.opacity = '0';
                        setTimeout(() => {
                          document.body.removeChild(searchOverlay);
                          
                          // Open product modal
                          showProductModal(
                            product.name, 
                            product.price, 
                            product.description, 
                            product.image
                          );
                        }, 300);
                      }
                    });
                    
                    const img = item.querySelector('img');
                    img.style.width = '50px';
                    img.style.height = '50px';
                    img.style.objectFit = 'cover';
                    img.style.marginRight = '15px';
                    img.style.borderRadius = '5px';
                    
                    const info = item.querySelector('.search-result-info');
                    info.style.flex = '1';
                    
                    const h3 = info.querySelector('h3');
                    h3.style.margin = '0';
                    h3.style.fontSize = '16px';
                    
                    const p = info.querySelector('p');
                    p.style.margin = '5px 0 0';
                    p.style.color = 'var(--primary-color)';
                    p.style.fontWeight = 'bold';
                  });
                }
                
                const noResults = searchOverlay.querySelector('.no-results');
                if (noResults) {
                  noResults.style.textAlign = 'center';
                  noResults.style.marginTop = '20px';
                  noResults.style.color = '#666';
                }
              }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function escHandler(e) {
              if (e.key === 'Escape') {
                searchOverlay.style.opacity = '0';
                setTimeout(() => {
                  document.body.removeChild(searchOverlay);
                  document.removeEventListener('keydown', escHandler);
                }, 300);
              }
            });
          });
        }
      });
// Cart functionality with local storage
const ShoppingCart = {
    // Initialize the cart
    init: function() {
      this.setupCartIcon();
      this.setupCartModal();
      this.updateCartBadge();
      this.bindEvents();
    },
  
    // Get cart items from local storage
    getCartItems: function() {
      return JSON.parse(localStorage.getItem('cartItems')) || [];
    },
  
    // Save cart items to local storage
    saveCartItems: function(items) {
      localStorage.setItem('cartItems', JSON.stringify(items));
    },
  
    // Add an item to the cart
    addToCart: function(product) {
      const cartItems = this.getCartItems();
      
      // Check if product already exists in cart
      const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingProductIndex > -1) {
        // Increase quantity if product already in cart
        cartItems[existingProductIndex].quantity += 1;
      } else {
        // Add new product to cart
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || 'default-product.jpg',
          quantity: 1
        });
      }
      
      this.saveCartItems(cartItems);
      this.updateCartBadge();
      this.updateCartModal();
      
      return cartItems.length;
    },
  
    // Remove an item from the cart
    removeFromCart: function(productId) {
      let cartItems = this.getCartItems();
      cartItems = cartItems.filter(item => item.id !== productId);
      this.saveCartItems(cartItems);
      this.updateCartBadge();
      this.updateCartModal();
    },
  
    // Update quantity of an item in the cart
    updateQuantity: function(productId, quantity) {
      const cartItems = this.getCartItems();
      const item = cartItems.find(item => item.id === productId);
      
      if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          this.saveCartItems(cartItems);
          this.updateCartModal();
        }
      }
      
      this.updateCartBadge();
    },
  
    // Calculate total items in cart
    getTotalItems: function() {
      const cartItems = this.getCartItems();
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    },
  
    // Calculate total price of items in cart
    getTotalPrice: function() {
      const cartItems = this.getCartItems();
      return cartItems.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + (price * item.quantity);
      }, 0);
    },
  
    // Update the cart badge counter
    updateCartBadge: function() {
      const cartIcon = document.querySelector('.nav-icons a:nth-child(2)');
      
      if (cartIcon) {
        let cartBadge = cartIcon.querySelector('.cart-badge');
        const totalItems = this.getTotalItems();
        
        if (!cartBadge) {
          cartBadge = document.createElement('span');
          cartBadge.className = 'cart-badge';
          cartIcon.style.position = 'relative';
          cartIcon.appendChild(cartBadge);
        }
        
        // Style the badge
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
        
        // Show or hide badge based on cart items
        if (totalItems > 0) {
          cartBadge.textContent = totalItems;
          cartBadge.style.display = 'flex';
        } else {
          cartBadge.style.display = 'none';
        }
      }
    },
  
    // Setup the cart icon click behavior
    setupCartIcon: function() {
      const cartIcon = document.querySelector('.nav-icons a:nth-child(2)');
      
      if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleCartModal();
        });
      }
    },
  
    // Create and setup the cart modal
    setupCartModal: function() {
      // Create cart modal if it doesn't exist
      if (!document.getElementById('cartModal')) {
        const modalHTML = `
          <div id="cartModal" class="cart-modal">
            <div class="cart-content">
              <div class="cart-header">
                <h2>Your Shopping Cart</h2>
                <button class="close-cart">&times;</button>
              </div>
              <div class="cart-items">
                <!-- Cart items will be dynamically inserted here -->
              </div>
              <div class="cart-footer">
                <div class="cart-total">Total: $<span id="cartTotal">0.00</span></div>
                <button class="checkout-btn">Checkout</button>
                <button class="continue-shopping">Continue Shopping</button>
              </div>
            </div>
          </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add CSS for the cart modal
        const style = document.createElement('style');
        style.textContent = `
          .cart-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: flex-start;
            padding-top: 80px;
          }
          
          .cart-content {
            background-color: white;
            width: 90%;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
          }
          
          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            background-color: var(--primary-color, #4CAF50);
            color: white;
          }
          
          .cart-header h2 {
            margin: 0;
            font-size: 1.5rem;
          }
          
          .close-cart {
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: white;
          }
          
          .cart-items {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
          }
          
          .cart-item {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
            position: relative;
          }
          
          .cart-item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 4px;
          }
          
          .cart-item-details {
            flex: 1;
          }
          
          .cart-item-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .cart-item-price {
            color: #666;
            margin-bottom: 10px;
          }
          
          .quantity-control {
            display: flex;
            align-items: center;
          }
          
          .quantity-btn {
            width: 28px;
            height: 28px;
            background-color: #f1f1f1;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          }
          
          .quantity-input {
            width: 40px;
            text-align: center;
            margin: 0 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 4px;
          }
          
          .remove-item {
            position: absolute;
            right: 0;
            top: 0;
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 1.2rem;
          }
          
          .cart-footer {
            padding: 15px 20px;
            border-top: 1px solid #eee;
            background-color: #f9f9f9;
          }
          
          .cart-total {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
          }
          
          .checkout-btn, .continue-shopping {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
          }
          
          .checkout-btn {
            background-color: var(--primary-color, #4CAF50);
            color: white;
          }
          
          .continue-shopping {
            background-color: #f1f1f1;
            color: #333;
          }
          
          .empty-cart-message {
            text-align: center;
            padding: 30px 0;
            color: #888;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          
          @media (max-width: 600px) {
            .cart-content {
              width: 95%;
            }
            
            .cart-item {
              flex-direction: column;
            }
            
            .cart-item-image {
              width: 100%;
              height: auto;
              margin-bottom: 10px;
            }
          }
        `;
        
        document.head.appendChild(style);
        
        // Set up close button and overlay click
        const modal = document.getElementById('cartModal');
        const closeBtn = modal.querySelector('.close-cart');
        const continueBtn = modal.querySelector('.continue-shopping');
        
        closeBtn.addEventListener('click', () => {
          this.closeCartModal();
        });
        
        continueBtn.addEventListener('click', () => {
          this.closeCartModal();
        });
        
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeCartModal();
          }
        });
        
        // Setup checkout button
        const checkoutBtn = modal.querySelector('.checkout-btn');
        checkoutBtn.addEventListener('click', () => {
          alert('Proceeding to checkout...');
          // Here you would redirect to checkout page
          // window.location.href = '/checkout.html';
        });
      }
      
      // Update cart content with current items
      this.updateCartModal();
    },
    
    // Toggle the cart modal visibility
    toggleCartModal: function() {
      const modal = document.getElementById('cartModal');
      
      if (modal.style.display === 'flex') {
        this.closeCartModal();
      } else {
        this.openCartModal();
      }
    },
    
    // Open the cart modal
    openCartModal: function() {
      const modal = document.getElementById('cartModal');
      modal.style.display = 'flex';
      
      // Update cart content when opening
      this.updateCartModal();
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    },
    
    // Close the cart modal
    closeCartModal: function() {
      const modal = document.getElementById('cartModal');
      modal.style.display = 'none';
      
      // Re-enable body scrolling
      document.body.style.overflow = '';
    },
    
    // Update the cart modal content
    updateCartModal: function() {
      const cartItems = this.getCartItems();
      const cartItemsContainer = document.querySelector('.cart-items');
      const cartTotal = document.getElementById('cartTotal');
      
      if (cartItemsContainer) {
        if (cartItems.length === 0) {
          cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        } else {
          cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="quantity-control">
                  <button class="quantity-btn decrease-qty">-</button>
                  <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                  <button class="quantity-btn increase-qty">+</button>
                </div>
              </div>
              <button class="remove-item">&times;</button>
            </div>
          `).join('');
          
          // Add event listeners for quantity buttons and remove buttons
          this.bindCartItemEvents();
        }
        
        // Update total price
        if (cartTotal) {
          cartTotal.textContent = this.getTotalPrice().toFixed(2);
        }
      }
    },
    
    // Bind events for cart item controls
    bindCartItemEvents: function() {
      const cartItems = document.querySelectorAll('.cart-item');
      
      cartItems.forEach(item => {
        const productId = item.dataset.id;
        const removeBtn = item.querySelector('.remove-item');
        const decreaseBtn = item.querySelector('.decrease-qty');
        const increaseBtn = item.querySelector('.increase-qty');
        const quantityInput = item.querySelector('.quantity-input');
        
        // Remove item button
        removeBtn.addEventListener('click', () => {
          this.removeFromCart(productId);
        });
        
        // Decrease quantity button
        decreaseBtn.addEventListener('click', () => {
          const currentQty = parseInt(quantityInput.value);
          if (currentQty > 1) {
            quantityInput.value = currentQty - 1;
            this.updateQuantity(productId, currentQty - 1);
          }
        });
        
        // Increase quantity button
        increaseBtn.addEventListener('click', () => {
          const currentQty = parseInt(quantityInput.value);
          quantityInput.value = currentQty + 1;
          this.updateQuantity(productId, currentQty + 1);
        });
        
        // Quantity input change
        quantityInput.addEventListener('change', () => {
          let value = parseInt(quantityInput.value);
          if (isNaN(value) || value < 1) {
            value = 1;
            quantityInput.value = 1;
          }
          this.updateQuantity(productId, value);
        });
      });
    },
    
    // Bind events for "Add to Cart" buttons
    bindEvents: function() {
      // This will be called when "Add to Cart" buttons are dynamically added
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
          e.preventDefault();
          
          // Get product information from the parent product card
          const productCard = e.target.closest('.product-card');
          if (productCard) {
            const productId = productCard.dataset.id || Date.now().toString();
            const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
            const productPrice = productCard.querySelector('.product-price')?.textContent || '$0.00';
            const productImage = productCard.querySelector('.product-image')?.src || 'default-product.jpg';
            
            const product = {
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage
            };
            
            this.addToCart(product);
            
            // Change button appearance
            e.target.innerHTML = 'Added to Cart';
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.pointerEvents = 'none';
            
            // Reset button after 2 seconds
            setTimeout(() => {
              e.target.innerHTML = 'Add to Cart';
              e.target.style.backgroundColor = '';
              e.target.style.pointerEvents = '';
            }, 2000);
            
            // Animate cart icon
            const cartIcon = document.querySelector('.nav-icons a:nth-child(2)');
            if (cartIcon) {
              cartIcon.style.animation = 'pulse 0.5s';
              setTimeout(() => {
                cartIcon.style.animation = '';
              }, 500);
            }
          }
        }
      });
    }
  };
  
  // Initialize cart when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    ShoppingCart.init();
  });
  
  // Modified add-to-cart code to work with the new cart system
  function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Button styles are now handled by the cart system's event listener
        // This is just to ensure compatibility with your existing code
      });
    });
  }
  
  // Function to update the product results display
  function displayColorProducts(predictions, products, resultsDiv) {
    resultsDiv.innerHTML = '';
    const topPredictions = predictions.slice(0, 3);
    
    topPredictions.forEach(prediction => {
      const color = prediction.className.toLowerCase();
      const percentage = Math.round(prediction.probability * 100);
      
      // Filter products by color (case-insensitive)
      const colorProducts = products.filter(product =>
        product.classes.some(cls => cls.toLowerCase() === color)
      );
      
      if (colorProducts.length > 0) {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.innerHTML = `
          <h2>${color.charAt(0).toUpperCase() + color.slice(1)} Products (${percentage}% match)</h2>
          <div class="product-grid">
            ${colorProducts.map(product => `
              <div class="product-card" data-id="${product.id || Math.random().toString(36).substr(2, 9)}">
                <img src="${product.image || 'default-product.jpg'}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
              </div>
            `).join('')}
          </div>
        `;
        resultsDiv.appendChild(categorySection);
      }
    });
    
    // Setup event listeners for newly added buttons
    setupAddToCartButtons();
  }
  
  // Back to Home button functionality
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
          section.style.display = 'block';
        }
      });
    }, 300);
  }
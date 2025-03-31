document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const messagesContainer = document.getElementById('chatbot-messages');
    const userTypeSelection = document.getElementById('user-type-selection');
    const textInputContainer = document.getElementById('text-input-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // State variables
    let userType = null; // 'farmer' or 'customer'
    let conversationContext = {
        topic: null,
        previousQuestions: [],
        userData: {}
    };

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('collapsed');
    });

    // Set up user type buttons
    document.querySelectorAll('.user-type-btn').forEach(button => {
        button.addEventListener('click', () => {
            userType = button.getAttribute('data-type');
            userTypeSelection.style.display = 'none';
            textInputContainer.style.display = 'flex';
            
            // Welcome message based on user type
            if (userType === 'farmer') {
                addBotMessage("Welcome, farmer! How can I help you today? You can ask about pricing guidance, logistics, or eligibility requirements.");
                addQuickReplies(['Pricing help', 'Logistics', 'Eligibility', 'Other question']);
            } else {
                addBotMessage("Welcome! How can I assist you with your farm-to-table experience? You can ask about product recommendations, order tracking, or learn about seasonal produce.");
                addQuickReplies(['Product recommendations', 'Track my order', 'Seasonal produce', 'Other question']);
            }
        });
    });

    // Handle user input
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle quick reply buttons
    function handleQuickReplyClick(event) {
        if (event.target.classList.contains('quick-reply-btn')) {
            const message = event.target.textContent;
            addUserMessage(message);
            processUserInput(message);
            
            // Remove all quick replies after selection
            document.querySelectorAll('.quick-replies').forEach(element => {
                element.remove();
            });
        }
    }
    
    messagesContainer.addEventListener('click', handleQuickReplyClick);

    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addUserMessage(message);
            processUserInput(message);
            userInput.value = '';
        }
    }

    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageElement.appendChild(messageContent);
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageElement.appendChild(messageContent);
        messagesContainer.appendChild(messageElement);
        scrollToBottom();
    }

    // Add quick reply buttons
    function addQuickReplies(replies) {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.classList.add('quick-replies');
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.classList.add('quick-reply-btn');
            button.textContent = reply;
            quickRepliesContainer.appendChild(button);
        });
        
        messagesContainer.appendChild(quickRepliesContainer);
        scrollToBottom();
    }

    // Process user input
    function processUserInput(message) {
        // Store the user's question in context
        conversationContext.previousQuestions.push(message.toLowerCase());
        
        // Simple keyword detection for demonstration
        const lowercaseMessage = message.toLowerCase();
        
        // Simulate typing delay
        setTimeout(() => {
            if (userType === 'farmer') {
                processFramerInput(lowercaseMessage);
            } else {
                processCustomerInput(lowercaseMessage);
            }
        }, 800);
    }

    // Process farmer input
    function processFramerInput(message) {
        // Set conversation topic based on keywords
        if (message.includes('price') || message.includes('pricing') || message.includes('how much')) {
            conversationContext.topic = 'pricing';
            addBotMessage("I can help with pricing guidance. What type of product are you looking to price?");
            addQuickReplies(['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Other']);
        } 
        else if (message.includes('logistics') || message.includes('delivery') || message.includes('transport')) {
            conversationContext.topic = 'logistics';
            addBotMessage("I can assist with logistics. What specific information do you need?");
            addQuickReplies(['Packaging', 'Transportation', 'Storage', 'Delivery scheduling']);
        }
        else if (message.includes('eligibility') || message.includes('requirements') || message.includes('qualify')) {
            conversationContext.topic = 'eligibility';
            addBotMessage("I can help determine your eligibility for selling products. What specific certification or program are you interested in?");
            addQuickReplies(['Organic certification', 'Local market requirements', 'Restaurant supply', 'Online marketplace']);
        }
        else if (message.includes('vegetable')) {
            addBotMessage("For vegetables, I recommend pricing based on weight and quality grade. Current market prices for premium vegetables are around $2-4 per pound, depending on the specific type. Would you like more specific pricing information for a particular vegetable?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('fruit')) {
            addBotMessage("For fruits, seasonal pricing is key. Currently, in-season fruits can command $3-6 per pound for premium quality. Would you like specific pricing information for a particular fruit?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('dairy')) {
            addBotMessage("For dairy products, pricing varies significantly based on processing and packaging. Raw milk typically sells for $6-8 per gallon, while artisanal cheeses can range from $12-20 per pound. Would you like more specific guidance?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('meat')) {
            addBotMessage("For meat products, pricing depends on cut, quality, and processing. Grass-fed beef typically sells for $6-10 per pound for ground beef and $15-25 for premium cuts. Would you like more specific pricing information?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('packaging')) {
            addBotMessage("For packaging, I recommend sustainable options that maintain product freshness. Popular choices include compostable bags for produce, glass jars for preserves, and insulated containers for dairy and meat. Would you like specific supplier recommendations?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('transportation')) {
            addBotMessage("For transportation, local deliveries are typically done with refrigerated vans for perishables. For longer distances, consider partnering with a distribution service. Would you like to know more about transportation regulations?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('storage')) {
            addBotMessage("For storage, temperature control is crucial. Vegetables require 32-38°F, fruits vary by type, dairy needs 34-38°F, and meat should be kept at 28-32°F. Would you like information on storage equipment?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('organic certification')) {
            addBotMessage("For USDA Organic certification, you'll need to maintain detailed records of farming practices, avoid prohibited substances for 3+ years, and complete an application with a certifying agent. The process typically takes 3-6 months. Would you like more details on the application process?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('local market')) {
            addBotMessage("Local farmers' markets typically require product liability insurance ($300-600 annually), a business license, and compliance with local health department regulations. Many also require that you grow or produce what you sell. Would you like specific information for markets in your area?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('yes') && conversationContext.previousQuestions.some(q => q.includes('specific'))) {
            addBotMessage("I'd be happy to provide more specific information. Could you tell me your location and the particular product you're interested in?");
        }
        else {
            addBotMessage("I'm here to help with pricing guidance, logistics support, and eligibility requirements. What specific information are you looking for today?");
            addQuickReplies(['Pricing help', 'Logistics', 'Eligibility', 'Other question']);
        }
    }

    // Process customer input
    function processCustomerInput(message) {
        // Set conversation topic based on keywords
        if (message.includes('recommendation') || message.includes('suggest') || message.includes('what should')) {
            conversationContext.topic = 'recommendations';
            addBotMessage("I'd be happy to recommend products. What type of products are you interested in?");
            addQuickReplies(['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Seasonal items']);
        } 
        else if (message.includes('track') || message.includes('order') || message.includes('delivery')) {
            conversationContext.topic = 'order tracking';
            addBotMessage("I can help track your order. Could you provide your order number or the email associated with your purchase?");
        }
        else if (message.includes('seasonal') || message.includes('in season')) {
            conversationContext.topic = 'seasonal';
            addBotMessage("Great question about seasonal produce! What season are you interested in?");
            addQuickReplies(['Spring', 'Summer', 'Fall', 'Winter', 'Current season']);
        }
        else if (message.includes('vegetable')) {
            addBotMessage("For vegetables, I recommend looking at our fresh leafy greens, heirloom tomatoes, and organic root vegetables. Our top-rated farm partners for vegetables include Green Valley Farms and Sunshine Organics. Would you like specific recommendations based on your dietary preferences?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('fruit')) {
            addBotMessage("For fruits, we have excellent stone fruits, berries, and apples available right now. Berry Hill Farm and Orchard Grove are particularly popular for their high-quality fruits. Would you like to know more about any specific fruits?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('dairy')) {
            addBotMessage("For dairy products, we offer farm-fresh milk, artisanal cheeses, and cultured products like yogurt and kefir. Happy Cow Creamery and Mountain View Dairy are customer favorites. Would you like recommendations for specific dairy products?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('meat')) {
            addBotMessage("For meat products, we offer grass-fed beef, free-range poultry, and heritage pork. Rolling Hills Ranch and Pastoral Farms are known for their exceptional quality and humane practices. Would you like to know more about their farming practices?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('spring')) {
            addBotMessage("Spring favorites include asparagus, peas, radishes, spinach, and strawberries. These are at their peak flavor and nutrition during spring months. Would you like recipes that feature these spring ingredients?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('summer')) {
            addBotMessage("Summer brings tomatoes, cucumbers, zucchini, corn, peaches, and berries. These sun-loving crops are perfect for fresh salads and grilling. Would you like to know about our summer farm boxes?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('fall')) {
            addBotMessage("Fall harvest includes apples, pears, pumpkins, winter squash, and root vegetables. These hearty crops are perfect for soups and roasting. Would you like to know about our fall harvest festivals?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('winter')) {
            addBotMessage("Winter brings citrus fruits, hardy greens like kale, stored root vegetables, and greenhouse-grown specialties. Would you like to know about our winter CSA options?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('current')) {
            // This would ideally be dynamic based on the actual date
            addBotMessage("For the current season, we recommend our seasonal farm box which includes the freshest produce available right now. Would you like to learn more about this option?");
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('yes') && conversationContext.previousQuestions.some(q => q.includes('dietary'))) {
            addBotMessage("Great! Do you have any specific dietary preferences or restrictions I should know about?");
            addQuickReplies(['Vegetarian', 'Vegan', 'Gluten-free', 'Organic only', 'No restrictions']);
        }
        else if (message.includes('yes') && conversationContext.previousQuestions.some(q => q.includes('recipe'))) {
            addBotMessage("I'd be happy to share some recipes! Here's a simple spring salad recipe: Mix fresh spinach, sliced strawberries, and radishes. Top with goat cheese and a light vinaigrette. Would you like more recipes?");
            addQuickReplies(['Yes, please', 'No, thanks']);
        }
        else if (message.match(/^[a-zA-Z0-9]{6,10}$/)) {
            // Simple regex to simulate order number
            addBotMessage(`Thank you for providing your order number. Your order is currently being processed and is scheduled for delivery on April 3rd. Would you like to receive updates on your order status?`);
            addQuickReplies(['Yes', 'No, thanks']);
        }
        else if (message.includes('@')) {
            // Simple check for email format
            addBotMessage(`Thank you for providing your email. I've found your recent order from March 29th. It's currently being prepared for shipment and should arrive within 2-3 business days. Would you like to make any changes to this order?`);
            addQuickReplies(['Yes', 'No, everything is correct']);
        }
        else {
            addBotMessage("I'm here to help with product recommendations, order tracking, and information about seasonal produce. What can I assist you with today?");
            addQuickReplies(['Product recommendations', 'Track my order', 'Seasonal produce', 'Other question']);
        }
    }

    // Auto-scroll to bottom of messages
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Initialize the chatbot as collapsed
    chatbotContainer.classList.add('collapsed');
});
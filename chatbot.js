class Chatbot {
    static GEMINI_API_KEY = "YOUR_API_KEY_HERE";
    
    static chatbotKnowledge = {
        greetings: [
            "Namaste! I'm your NIVARANX AI Assistant. How can I assist you with government services today?",
            // ... other responses
        ],
        // ... other knowledge categories
    };

    static async checkEligibilityWithAI() {
        const query = document.getElementById('eligibilityQuery').value.trim();
        const resultsDiv = document.getElementById('eligibilityResults');

        if (!query) {
            Utils.showToast('कृपया अपनी ज़रूरतें बताएं।', 'warning');
            return;
        }

        resultsDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> सुझाव ढूंढ रहा है...';
        resultsDiv.classList.add('loading');
        resultsDiv.classList.remove('error');

        try {
            const response = await this.makeAPICall(query);
            
            if (response.success) {
                resultsDiv.innerHTML = response.data;
                resultsDiv.classList.remove('loading');
                Utils.showToast('सुझाव प्राप्त हुए!', 'success');
            } else {
                throw new Error(response.error || 'Unknown error');
            }
        } catch (error) {
            console.error('AI Eligibility Check Error:', error);
            this.handleAIError(error, resultsDiv);
        }
    }

    static async makeAPICall(query) {
        // Prepare services list
        let servicesList = "";
        for (const categoryKey in Services.serviceData) {
            servicesList += `\n${Services.serviceData[categoryKey].name} Services:\n`;
            Services.serviceData[categoryKey].services.forEach(service => {
                servicesList += `- ${service.name} (Fees: ${typeof service.fees.total === 'number' ? '₹' + service.fees.total : service.fees.total})\n`;
            });
        }

        const prompt = `You are an AI assistant for the NIVARANX government services portal. Your task is to help users find relevant government services based on their needs.
        
        Here is a list of services available on NIVARANX:
        ${servicesList}

        User's request: "${query}"

        Based on the user's request, suggest up to 3 most relevant services from the list above. For each suggested service, briefly explain why it's relevant. If no relevant services are found, state that. Respond in Hindi.`;

        const apiKey = this.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
            return {
                success: false,
                error: 'API configuration missing'
            };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return {
                success: true,
                data: result.candidates[0].content.parts[0].text
            };
        } else {
            throw new Error('Invalid API response format');
        }
    }

    static handleAIError(error, resultsDiv) {
        resultsDiv.classList.remove('loading');
        resultsDiv.classList.add('error');
        
        if (error.message.includes('API configuration')) {
            resultsDiv.innerHTML = 'सेवा अस्थायी रूप से उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।';
        } else if (error.message.includes('network') || !navigator.onLine) {
            resultsDiv.innerHTML = 'इंटरनेट कनेक्शन की समस्या है। कृपया अपना कनेक्शन जांचें।';
        } else {
            resultsDiv.innerHTML = 'सुझाव प्राप्त करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।';
        }
        
        Utils.showToast('सेवा अस्थायी रूप से उपलब्ध नहीं है', 'error');
    }

    static async getChatbotResponse(message) {
        // Chatbot response logic
        const lowerMsg = message.toLowerCase();
        
        // Check for different message types and return appropriate response
        // ... (Copy your existing chatbot logic)
    }
}

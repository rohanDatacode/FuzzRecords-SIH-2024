document.addEventListener('DOMContentLoaded', function() {
    console.log('Suggestions script loaded');

    // 1. SHARED VARIABLES (Declared only once)
    const searchInput = document.querySelector('#search-input');
    const firstNameInput = document.getElementById('firstNameInput');
    const middleNameInput = document.getElementById('middleNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const voiceButton = document.getElementById('voiceSearchButton');
    const micStatus = document.getElementById('micStatus');
    const speechModal = document.getElementById('speechModal');
    
    let focusedInputId = null; // Track which input is being used
    let debounceTimer;
    let isListening = false;
    let recognition = null;

    const fieldLabels = {
        'firstNameInput': 'First Name / पहला नाम',
        'middleNameInput': 'Middle Name / मध्य नाम',
        'lastNameInput': 'Last Name / उपनाम'
    };

    // 2. GLOBAL SEARCH SUGGESTIONS
    if (searchInput) {
        const suggestionsList = document.createElement('ul');
        suggestionsList.className = 'suggestions-list absolute w-full bg-white border border-gray-300 rounded-b shadow-lg z-50 max-h-60 overflow-y-auto';
        searchInput.parentElement.appendChild(suggestionsList);

        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            if (!this.value.trim()) {
                suggestionsList.innerHTML = '';
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const response = await fetch(`/analytics/api/suggestions?query=${encodeURIComponent(this.value)}`);
                    const suggestions = await response.json();
                    suggestionsList.innerHTML = '';
                    
                    if (suggestions.length === 0) {
                        suggestionsList.innerHTML = `<li class="px-4 py-2 text-gray-500">No matches found</li>`;
                        return;
                    }

                    suggestions.forEach(suggestion => {
                        const li = document.createElement('li');
                        li.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer';
                        li.textContent = suggestion.name;
                        li.addEventListener('click', () => {
                            searchInput.value = suggestion.name;
                            suggestionsList.innerHTML = '';
                            searchInput.closest('form').submit();
                        });
                        suggestionsList.appendChild(li);
                    });
                } catch (error) { console.error('Error:', error); }
            }, 300);
        });
    }

    // 3. FIELD-SPECIFIC SUGGESTIONS (First, Middle, Last Name)
    async function fetchFieldSuggestions(type) {
        const inputVal = document.getElementById(`${type}Input`).value;
        const listEl = document.getElementById(`${type}SuggestionsList`);
        
        if (!listEl) return;
        if (inputVal.trim().length < 2) {
            listEl.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`/api/suggestions?type=${type}&query=${encodeURIComponent(inputVal)}`);
            const suggestions = await response.json();

            if (suggestions.length === 0) {
                listEl.style.display = 'none';
                return;
            }

            listEl.innerHTML = suggestions.map(suggestion => {
                const nameField = type === 'firstName' ? 'firstNameEnglish' : type === 'middleName' ? 'middleNameEnglish' : 'lastNameEnglish';
                const hindiField = type === 'firstName' ? 'firstNameHindi' : type === 'middleName' ? 'middleNameHindi' : 'lastNameHindi';
                return `
                    <li class="px-4 py-2 hover:bg-blue-400/20 cursor-pointer transition-all"
                        onclick="selectSuggestion('${type}', '${suggestion[nameField]}')">
                        ${suggestion[nameField]} <span class="text-sm text-gray-400">(${suggestion[hindiField] || ''})</span>
                    </li>`;
            }).join('');
            listEl.style.display = 'block';
        } catch (error) { console.error('Field Suggestion Error:', error); }
    }

    // Attach listeners to name fields if they exist
    [firstNameInput, middleNameInput, lastNameInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                const type = input.id.replace('Input', '');
                fetchFieldSuggestions(type);
            });
            input.addEventListener('focus', () => { focusedInputId = input.id; });
        }
    });

    // 4. VOICE SEARCH LOGIC
    function updateMicStatus() {
        if (micStatus) {
            if (isListening) {
                micStatus.classList.remove('hidden');
                micStatus.textContent = `Listening for ${fieldLabels[focusedInputId] || '...'}`;
            } else {
                micStatus.classList.add('hidden');
            }
        }
    }

    function startVoiceInput() {
        if (!focusedInputId) {
            alert('Please click on a name field first');
            return;
        }
        if (isListening) { stopVoiceInput(); return; }

        isListening = true;
        if (speechModal) speechModal.style.display = 'flex';
        updateMicStatus();
        startSpeechRecognition();
    }

    function stopVoiceInput() {
        if (recognition) recognition.stop();
        if (speechModal) speechModal.style.display = 'none';
        isListening = false;
        updateMicStatus();
    }

    function startSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Please use Chrome.');
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.lang = 'hi-IN'; // Default to Hindi

        recognition.onresult = function(event) {
            const result = event.results[0][0].transcript;
            if (focusedInputId) {
                const input = document.getElementById(focusedInputId);
                input.value = result;
                input.dispatchEvent(new Event('input')); // Trigger suggestion fetch
                input.focus();
            }
            stopVoiceInput();
        };

        recognition.onerror = () => stopVoiceInput();
        recognition.onend = () => stopVoiceInput();
        recognition.start();
    }

    // Make functions global so EJS buttons can see them
    window.selectSuggestion = function(type, value) {
        const input = document.getElementById(`${type}Input`);
        input.value = value;
        document.getElementById(`${type}SuggestionsList`).style.display = 'none';
    };

    window.startVoiceInput = startVoiceInput;
    window.stopVoiceInput = stopVoiceInput;

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        document.querySelectorAll('ul[id$="SuggestionsList"]').forEach(list => {
            if (!e.target.closest('input')) list.style.display = 'none';
        });
    });
});
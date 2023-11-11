const apiKey = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud'; // Replace with your actual API key
const API_URL = 'VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM'; // Replace with your actual API URL
const form = document.getElementById('comic-form');
const comicText = document.getElementById('comic-text');
const comicPanels = document.getElementById('comic-panels');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = comicText.value.trim().split('\n');

    if (text.length !== 10) {
        errorMessage.innerText = 'Please enter text for all 10 panels.';
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';

    generateComic(text);
});

function generateComic(text) {
    comicPanels.innerHTML = '';

    text.forEach((panelText, index) => {
        const data = { inputs: panelText };
        query(data)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('API request failed');
                }
            })
            .then(imageBlob => {
                const panel = document.createElement('div');
                panel.classList.add('comic-panel');
                const img = document.createElement('img');
                img.src = URL.createObjectURL(imageBlob);
                panel.appendChild(img);
                comicPanels.appendChild(panel);

                if (index === text.length - 1) {
                    comicPanels.style.display = 'flex';
                }
            })
            .catch(error => {
                errorMessage.innerText = 'Error generating comic.';
                errorMessage.style.display = 'block';
            });
    });
}

function query(data) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

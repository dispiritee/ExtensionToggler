document.addEventListener('DOMContentLoaded', function() {
    const addFab = document.getElementById('addFab');
    const addMenu = document.getElementById('addMenu');
    const extensionsList = document.getElementById('extensionsList');
    const installedExtensionsSelect = document.getElementById('installedExtensions');
    const addExtensionBtn = document.getElementById('addExtensionBtn');
    const telegramButton = document.getElementById('telegramButton');

    chrome.storage.sync.get({ extensions: [] }, function(result) {
        const savedExtensions = result.extensions;
        savedExtensions.forEach(function(savedExtension) {
            chrome.management.get(savedExtension.id, function(extension) {
                if (extension) {
                    addExtensionToList(extension);
                }
            });
        });
    });

    addFab.addEventListener('click', function() {
        addMenu.classList.toggle('active');

        chrome.management.getAll(function(extensions) {
            installedExtensionsSelect.innerHTML = '';
            extensions.forEach(function(extension) {
                if (!extension.isApp && extension.id !== chrome.runtime.id) { // Исключаем само расширение
                    const option = document.createElement('option');
                    option.value = extension.id;
                    option.textContent = extension.name;
                    installedExtensionsSelect.appendChild(option);
                }
            });
        });
    });

    addExtensionBtn.addEventListener('click', function() {
        const selectedExtensionId = installedExtensionsSelect.value;
        chrome.management.get(selectedExtensionId, function(extension) {
            addExtensionToList(extension);
            saveExtensionToStorage(extension);
        });
    });

    function addExtensionToList(extension) {
        const listItem = document.createElement('div');
        listItem.classList.add('extension-item');

        const label = document.createElement('label');
        label.textContent = extension.name;

        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('toggle-container');

        const toggleSwitch = document.createElement('input');
        toggleSwitch.type = 'checkbox';
        toggleSwitch.checked = extension.enabled;
        toggleSwitch.addEventListener('change', function() {
            chrome.management.setEnabled(extension.id, toggleSwitch.checked);
        });

        const removeButton = document.createElement('span');
        removeButton.textContent = '❌';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', function() {
            listItem.remove();
            removeExtensionFromStorage(extension.id);
        });

        toggleContainer.appendChild(toggleSwitch);
        toggleContainer.appendChild(removeButton);
        listItem.appendChild(label);
        listItem.appendChild(toggleContainer);
        extensionsList.appendChild(listItem);
    }

    function saveExtensionToStorage(extension) {
        chrome.storage.sync.get({ extensions: [] }, function(result) {
            const extensions = result.extensions;
            if (!extensions.find(ext => ext.id === extension.id)) {
                extensions.push({ id: extension.id, name: extension.name });
                chrome.storage.sync.set({ extensions: extensions });
            }
        });
    }

    function removeExtensionFromStorage(extensionId) {
        chrome.storage.sync.get({ extensions: [] }, function(result) {
            const extensions = result.extensions.filter(ext => ext.id !== extensionId);
            chrome.storage.sync.set({ extensions: extensions });
        });
    }

    telegramButton.addEventListener('click', function() {
        window.open('https://t.me/dispiritee', '_blank');
    });
});

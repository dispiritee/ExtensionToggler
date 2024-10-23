document.addEventListener('DOMContentLoaded', () => {
  const extensionsList = document.getElementById('extensionsList');
  const addExtensionBtn = document.getElementById('addExtensionBtn');
  const extensionForm = document.getElementById('extensionForm');
  const saveExtensionBtn = document.getElementById('saveExtensionBtn');
  const extensionNameInput = document.getElementById('extensionName');
  const extensionIdInput = document.getElementById('extensionId');
  let editingExtensionIndex = -1;

  function loadExtensions() {
    chrome.storage.sync.get('extensions', (data) => {
      const extensions = data.extensions || [];
      renderExtensions(extensions);
    });
  }

  function renderExtensions(extensions) {
    extensionsList.innerHTML = '';
    extensions.forEach((extension, index) => {
      const extensionContainer = document.createElement('div');
      extensionContainer.classList.add('toggle-container');

      const toggleSwitch = document.createElement('input');
      toggleSwitch.type = 'checkbox';
      toggleSwitch.checked = extension.enabled;
      toggleSwitch.addEventListener('change', () => toggleExtension(extension.id, toggleSwitch.checked));

      const label = document.createElement('label');
      label.textContent = extension.name;

      const settingsButton = document.createElement('span');
      settingsButton.classList.add('settings-button');
      settingsButton.innerHTML = '⚙️';
      settingsButton.addEventListener('click', () => editExtension(index, extension));

      extensionContainer.appendChild(toggleSwitch);
      extensionContainer.appendChild(label);
      extensionContainer.appendChild(settingsButton);
      extensionsList.appendChild(extensionContainer);
    });
  }

  function toggleExtension(extensionId, enabled) {
    chrome.management.setEnabled(extensionId, enabled, () => {
      console.log(`Extension ${extensionId} ${enabled ? 'enabled' : 'disabled'}`);
    });
  }

  addExtensionBtn.addEventListener('click', () => {
    if (extensionForm.classList.contains('active')) {
      extensionForm.classList.remove('active');
      extensionNameInput.value = '';
      extensionIdInput.value = '';
    } else {
      extensionForm.classList.add('active');
      editingExtensionIndex = -1;
    }
  });

  saveExtensionBtn.addEventListener('click', () => {
    const name = extensionNameInput.value.trim();
    const id = extensionIdInput.value.trim();

    if (name && id) {
      chrome.storage.sync.get('extensions', (data) => {
        const extensions = data.extensions || [];

        if (editingExtensionIndex >= 0) {
          extensions[editingExtensionIndex].name = name;
          extensions[editingExtensionIndex].id = id;
        } else {
          extensions.push({ name, id, enabled: false });
        }

        chrome.storage.sync.set({ extensions }, () => {
          extensionForm.classList.remove('active');
          extensionNameInput.value = '';
          extensionIdInput.value = '';
          loadExtensions();
        });
      });
    }
  });

  function editExtension(index, extension) {
    if (extensionForm.classList.contains('active') && editingExtensionIndex === index) {
      extensionForm.classList.remove('active');
      extensionNameInput.value = '';
      extensionIdInput.value = '';
      editingExtensionIndex = -1;
    } else {
      extensionForm.classList.add('active');
      extensionNameInput.value = extension.name;
      extensionIdInput.value = extension.id;
      editingExtensionIndex = index;
    }
  }

  loadExtensions();
});

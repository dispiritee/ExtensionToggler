document.addEventListener('DOMContentLoaded', function() {
  const extensionsList = document.getElementById('extensionsList');
  const addFab = document.getElementById('addFab');
  const addMenu = document.getElementById('addMenu');
  const installedExtensions = document.getElementById('installedExtensions');
  const addExtensionBtn = document.getElementById('addExtensionBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');
  const removeAllBtn = document.getElementById('removeAllBtn');
  const addAllBtn = document.getElementById('addAllBtn');

  let installedExts = [];

  chrome.management.getAll((extensions) => {
      installedExts = extensions.filter(ext => !ext.isApp);
      installedExts.forEach(ext => {
          const option = document.createElement('option');
          option.value = ext.id;
          option.textContent = ext.name;
          installedExtensions.appendChild(option);
      });
  });

  addFab.addEventListener('click', () => {
      addMenu.classList.toggle('active');
  });

  addExtensionBtn.addEventListener('click', () => {
      const selectedExtId = installedExtensions.value;
      const selectedExt = installedExts.find(ext => ext.id === selectedExtId);
      if (selectedExt) {
          addExtensionToList(selectedExt);
      }
      addMenu.classList.remove('active');
  });

  function addExtensionToList(extension) {
      const listItem = document.createElement('div');
      listItem.classList.add('extension-item');
      listItem.innerHTML = `
          <div class="toggle-container">
              <label>${extension.name}</label>
              <label class="remove-button">❌</label>
          </div>
          <label class="toggle-switch">
              <input type="checkbox" ${extension.enabled ? 'checked' : ''}>
              <span class="slider"></span>
          </label>
      `;
      extensionsList.appendChild(listItem);

      const toggleSwitch = listItem.querySelector('input[type="checkbox"]');
      toggleSwitch.addEventListener('change', function() {
          chrome.management.setEnabled(extension.id, toggleSwitch.checked);
      });

      const removeButton = listItem.querySelector('.remove-button');
      removeButton.addEventListener('click', () => {
          extensionsList.removeChild(listItem);
      });
  }

  settingsBtn.addEventListener('click', () => {
      settingsMenu.classList.toggle('active');
  });

  removeAllBtn.addEventListener('click', () => {
      extensionsList.innerHTML = '';
  });

  addAllBtn.addEventListener('click', () => {
      installedExts.forEach(addExtensionToList);
  });
});

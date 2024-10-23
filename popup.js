// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const extensionsList = document.getElementById('extensionsList');
  const addExtensionBtn = document.getElementById('addExtensionBtn');
  const extensionForm = document.getElementById('extensionForm');
  const saveExtensionBtn = document.getElementById('saveExtensionBtn');
  const extensionNameInput = document.getElementById('extensionName');
  const extensionIdInput = document.getElementById('extensionId');
  let editingExtensionIndex = -1; // Для отслеживания редактируемого расширения

  // Функция для загрузки сохраненных расширений
  function loadExtensions() {
    chrome.storage.sync.get('extensions', (data) => {
      const extensions = data.extensions || [];
      renderExtensions(extensions);
    });
  }

  // Функция для отображения списка расширений
  function renderExtensions(extensions) {
    extensionsList.innerHTML = ''; // Очистим список
    extensions.forEach((extension, index) => {
      const extensionContainer = document.createElement('div');
      extensionContainer.classList.add('toggle-container');

      // Тумблер для включения/выключения расширения
      const toggleSwitch = document.createElement('input');
      toggleSwitch.type = 'checkbox';
      toggleSwitch.checked = extension.enabled;
      toggleSwitch.addEventListener('change', () => toggleExtension(extension.id, toggleSwitch.checked));

      // Название расширения
      const label = document.createElement('label');
      label.textContent = extension.name;

      // Кнопка настроек для редактирования (шестеренка)
      const settingsButton = document.createElement('span');
      settingsButton.classList.add('settings-button');
      settingsButton.innerHTML = '⚙️'; // Символ шестеренки
      settingsButton.addEventListener('click', () => editExtension(index, extension));

      // Добавляем элементы в контейнер
      extensionContainer.appendChild(toggleSwitch);
      extensionContainer.appendChild(label);
      extensionContainer.appendChild(settingsButton);
      extensionsList.appendChild(extensionContainer);
    });
  }

  // Функция для включения/выключения расширения
  function toggleExtension(extensionId, enabled) {
    chrome.management.setEnabled(extensionId, enabled, () => {
      console.log(`Extension ${extensionId} ${enabled ? 'enabled' : 'disabled'}`);
    });
  }

  // Функция для открытия/закрытия формы добавления нового расширения с анимацией
  addExtensionBtn.addEventListener('click', () => {
    if (extensionForm.classList.contains('active')) {
      // Закрываем форму, если она уже открыта
      extensionForm.classList.remove('active');
      extensionNameInput.value = '';
      extensionIdInput.value = '';
    } else {
      // Открываем форму
      extensionForm.classList.add('active');
      editingExtensionIndex = -1; // Сброс редактируемого индекса
    }
  });

  // Сохранение нового или отредактированного расширения
  saveExtensionBtn.addEventListener('click', () => {
    const name = extensionNameInput.value.trim();
    const id = extensionIdInput.value.trim();

    if (name && id) {
      chrome.storage.sync.get('extensions', (data) => {
        const extensions = data.extensions || [];

        if (editingExtensionIndex >= 0) {
          // Редактирование существующего расширения
          extensions[editingExtensionIndex].name = name;
          extensions[editingExtensionIndex].id = id;
        } else {
          // Добавление нового расширения
          extensions.push({ name, id, enabled: false });
        }

        // Сохраняем расширения и обновляем UI
        chrome.storage.sync.set({ extensions }, () => {
          extensionForm.classList.remove('active'); // Закрываем форму с анимацией
          extensionNameInput.value = '';
          extensionIdInput.value = '';
          loadExtensions();
        });
      });
    }
  });

  // Функция для редактирования расширения
  function editExtension(index, extension) {
    if (extensionForm.classList.contains('active') && editingExtensionIndex === index) {
      // Закрываем форму, если она уже открыта для редактирования того же элемента
      extensionForm.classList.remove('active');
      extensionNameInput.value = '';
      extensionIdInput.value = '';
      editingExtensionIndex = -1;
    } else {
      // Открываем форму и заполняем поля для редактирования
      extensionForm.classList.add('active');
      extensionNameInput.value = extension.name;
      extensionIdInput.value = extension.id;
      editingExtensionIndex = index; // Сохраняем индекс редактируемого расширения
    }
  }

  // Загрузка расширений при запуске
  loadExtensions();
});

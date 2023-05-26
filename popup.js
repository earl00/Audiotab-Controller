function updateButton(button, tab) {
    const img = button.querySelector('img');
    const span = button.querySelector('span');
  
    img.onerror = function() {
      this.onerror = null;
      this.src = 'default_icon.png'; // replace with your default icon path
    };
    img.src = tab.favIconUrl;
    
    span.textContent = tab.title;
  
    if (tab.mutedInfo.muted) {
      span.classList.remove('playing');
      span.classList.add('muted');
    } else {
      span.classList.remove('muted');
      span.classList.add('playing');
    }
  }
  
  chrome.runtime.sendMessage({message: 'getTabs'}, async (response) => {
    const tabs = response.data;
    const container = document.getElementById('tabs');
  
    if (tabs.length === 0) {
      container.textContent = 'No current windows playing audio';
      return;
    }
  
    tabs.forEach((tab) => {
      const button = document.createElement('button');
      const img = document.createElement('img');
      const span = document.createElement('span');
  
      img.onerror = function() {
        this.onerror = null;
        this.src = 'default_icon.png'; // replace with your default icon path
      };
      img.src = tab.favIconUrl;
      img.width = 16;
      img.height = 16;
      button.appendChild(img);
  
      span.textContent = tab.title;
      button.appendChild(span);
  
      button.onclick = async () => {
        const currentTab = await chrome.tabs.get(tab.id);
        const updatedTab = await chrome.tabs.update(tab.id, {muted: !currentTab.mutedInfo.muted});
        updateButton(button, updatedTab);
      };
  
      updateButton(button, tab);
      container.appendChild(button);
    });
  });
  
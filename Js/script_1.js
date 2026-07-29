
    // ============================================
    // NO API VISIBLE - Everything is hidden!
    // ============================================

    // DOM Elements
    const phoneInput = document.getElementById('phoneNumber');
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const codeBox = document.getElementById('codeBox');
    const copyBtn = document.getElementById('copyBtn');
    const toast = document.getElementById('toast');
    const form = document.getElementById('pairForm');
    const serverInfo = document.getElementById('serverInfo');
    const serverSelection = document.getElementById('serverSelection');
    const serverGrid = document.getElementById('serverGrid');
    const currentServerName = document.getElementById('currentServerName');
    const activeCount = document.getElementById('activeCount');
    const serverLimit = document.getElementById('serverLimit');
    const cooldownTimer = document.getElementById('cooldownTimer');
    const cooldownSeconds = document.getElementById('cooldownSeconds');

    let currentCode = null;
    let selectedServer = null;
    let cooldownInterval = null;
    let isCooldown = false;
    let displayServers = [];

    // 60 SERVERS HARDCODED
    const allServers = [
      { id: 'server1', name: 'Server 1' }, { id: 'server2', name: 'Server 2' },
      { id: 'server3', name: 'Server 3' }, { id: 'server4', name: 'Server 4' },
      { id: 'server5', name: 'Server 5' }, { id: 'server6', name: 'Server 6' },
      { id: 'server7', name: 'Server 7' }, { id: 'server8', name: 'Server 8' },
      { id: 'server9', name: 'Server 9' }, { id: 'server10', name: 'Server 10' },
      { id: 'server11', name: 'Server 11' }, { id: 'server12', name: 'Server 12' },
      { id: 'server13', name: 'Server 13' }, { id: 'server14', name: 'Server 14' },
      { id: 'server15', name: 'Server 15' }, { id: 'server16', name: 'Server 16' },
      { id: 'server17', name: 'Server 17' }, { id: 'server18', name: 'Server 18' },
      { id: 'server19', name: 'Server 19' }, { id: 'server20', name: 'Server 20' },
      { id: 'server21', name: 'Server 21' }, { id: 'server22', name: 'Server 22' },
      { id: 'server23', name: 'Server 23' }, { id: 'server24', name: 'Server 24' },
      { id: 'server25', name: 'Server 25' }, { id: 'server26', name: 'Server 26' },
      { id: 'server27', name: 'Server 27' }, { id: 'server28', name: 'Server 28' },
      { id: 'server29', name: 'Server 29' }, { id: 'server30', name: 'Server 30' },
      { id: 'server31', name: 'Server 31' }, { id: 'server32', name: 'Server 32' },
      { id: 'server33', name: 'Server 33' }, { id: 'server34', name: 'Server 34' },
      { id: 'server35', name: 'Server 35' }, { id: 'server36', name: 'Server 36' },
      { id: 'server37', name: 'Server 37' }, { id: 'server38', name: 'Server 38' },
      { id: 'server39', name: 'Server 39' }, { id: 'server40', name: 'Server 40' },
      { id: 'server41', name: 'Server 41' }, { id: 'server42', name: 'Server 42' },
      { id: 'server43', name: 'Server 43' }, { id: 'server44', name: 'Server 44' },
      { id: 'server45', name: 'Server 45' }, { id: 'server46', name: 'Server 46' },
      { id: 'server47', name: 'Server 47' }, { id: 'server48', name: 'Server 48' },
      { id: 'server49', name: 'Server 49' }, { id: 'server50', name: 'Server 50' },
      { id: 'server51', name: 'Server 51' }, { id: 'server52', name: 'Server 52' },
      { id: 'server53', name: 'Server 53' }, { id: 'server54', name: 'Server 54' },
      { id: 'server55', name: 'Server 55' }, { id: 'server56', name: 'Server 56' },
      { id: 'server57', name: 'Server 57' }, { id: 'server58', name: 'Server 58' },
      { id: 'server59', name: 'Server 59' }, { id: 'server60', name: 'Server 60' }
    ];

    // Randomize server order: pick random start, then sequential with wrap-around
    function shuffleServerOrder() {
      const randomIndex = Math.floor(Math.random() * allServers.length);
      displayServers = [
        ...allServers.slice(randomIndex),
        ...allServers.slice(0, randomIndex)
      ];
    }

    // Hidden function - NO API visible!
    async function _secretRequest(action, data) {
      const response = await fetch('/x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: action, b: data })
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const result = await response.json();

      if (result.e) {
        throw new Error(result.e);
      }

      return result;
    }

    // Hidden function to check server status
    async function _checkServerStatus(serverId) {
      try {
        const result = await _secretRequest('status', serverId);
        return result;
      } catch (error) {
        throw error;
      }
    }

    // Hidden function to generate code
    async function _generateCode(serverId, number) {
      try {
        const result = await _secretRequest('gen', { server: serverId, number: number });
        return result.c;
      } catch (error) {
        throw error;
      }
    }

    // Toast notification
    function showToast(message, isError = false) {
      const toastIcon = toast.querySelector('i');
      const toastText = toast.querySelector('span');

      toastIcon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
      toastText.textContent = message;
      toast.className = `toast ${isError ? 'error' : ''} show`;

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Cooldown Timer Functions
    function startCooldown() {
      isCooldown = true;
      let seconds = 30;

      generateBtn.disabled = true;
      generateBtn.classList.add('cooldown');
      generateBtn.innerHTML = `<i class="fas fa-clock"></i> Wait ${seconds}s`;
      cooldownTimer.classList.add('show');
      cooldownSeconds.textContent = seconds;

      cooldownInterval = setInterval(() => {
        seconds--;
        cooldownSeconds.textContent = seconds;
        generateBtn.innerHTML = `<i class="fas fa-clock"></i> Wait ${seconds}s`;

        if (seconds <= 0) {
          clearInterval(cooldownInterval);
          endCooldown();
        }
      }, 1000);
    }

    function endCooldown() {
      isCooldown = false;
      clearInterval(cooldownInterval);
      cooldownTimer.classList.remove('show');
      generateBtn.classList.remove('cooldown');
      generateBtn.innerHTML = '<i class="fas fa-key"></i> Generate Pair Code';

      // Only enable if server is selected and not full/offline
      if (selectedServer) {
        generateBtn.disabled = false;
      }
    }

    // Initialize the app
    function initApp() {
      shuffleServerOrder();
      populateServerGrid(displayServers);
      serverInfo.addEventListener('click', showServerSelection);
    }

    // Populate server grid
    function populateServerGrid(servers) {
      serverGrid.innerHTML = '';

      servers.forEach(server => {
        const isSelected = selectedServer === server.id;

        const serverOption = document.createElement('div');
        serverOption.className = `server-option ${isSelected ? 'selected' : ''}`;
        serverOption.dataset.server = server.id;

        serverOption.innerHTML = `
          <div class="server-option-name">
            ${server.name}
          </div>
          <div class="server-option-stats">
            <span>Click to select</span>
          </div>
        `;

        serverOption.addEventListener('click', () => selectServer(server.id, serverOption));
        serverGrid.appendChild(serverOption);
      });
    }

    // Select a server and check its status - FAST response
    async function selectServer(serverId, clickedElement) {
      selectedServer = serverId;

      // FAST: Immediately highlight the clicked server and show checking state
      if (clickedElement) {
        document.querySelectorAll('.server-option').forEach(el => el.classList.remove('selected'));
        clickedElement.classList.add('selected');
        clickedElement.classList.add('loading');
      }

      const serverNum = serverId.replace('server', '');
      currentServerName.textContent = `Server ${serverNum}`;
      activeCount.innerHTML = `<i class="fas fa-circle" style="color:#8b5cf6;"></i> Checking...`;
      serverLimit.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading`;
      generateBtn.disabled = true;

      // Hide server selection immediately for fast feel
      hideServerSelection();

      await updateServerStatus(serverId);

      // Remove loading state from grid
      if (clickedElement) {
        clickedElement.classList.remove('loading');
      }
    }

    // Update server status using hidden function
    async function updateServerStatus(serverId) {
      try {
        const status = await _checkServerStatus(serverId);
        const serverNum = serverId.replace('server', '');
        currentServerName.textContent = `Server ${serverNum}`;

        if (status.error) {
          activeCount.innerHTML = `<i class="fas fa-circle" style="color:#f43f5e;"></i> Status: OFFLINE`;
          serverLimit.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Server Down`;
          generateBtn.disabled = true;
          showErrorInCode(`Server ${serverNum} is offline. Please select another server.`);
          showToast(`Server ${serverNum} is offline`, true);
        } else {
          const count = status.count || 0;
          const limit = status.limit || 50;

          if (count >= limit) {
            activeCount.innerHTML = `<i class="fas fa-circle" style="color:#f59e0b;"></i> Status: FULL`;
            serverLimit.innerHTML = `<i class="fas fa-users"></i> ${count}/${limit}`;
            generateBtn.disabled = true;
            showErrorInCode(`Server ${serverNum} is full! Please select another server.`);
            showToast(`Server ${serverNum} is full`, true);
          } else {
            activeCount.innerHTML = `<i class="fas fa-circle" style="color:#8b5cf6;"></i> Active: ${count}`;
            serverLimit.innerHTML = `<i class="fas fa-users"></i> Limit: ${count}/${limit}`;
            // Only enable if not in cooldown
            if (!isCooldown) {
              generateBtn.disabled = false;
            }
            if (codeBox.classList.contains('has-error')) {
              resetCodeBox();
            }
            showToast(`Server ${serverNum} is ready!`, false);
          }
        }

        populateServerGrid(displayServers);

      } catch (error) {
        const serverNum = serverId.replace('server', '');
        currentServerName.textContent = `Server ${serverNum}`;
        activeCount.innerHTML = `<i class="fas fa-circle" style="color:#f43f5e;"></i> Status: OFFLINE`;
        serverLimit.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Server Down`;
        generateBtn.disabled = true;
        showErrorInCode(`Server ${serverNum} is not responding. Please select another server.`);
        showToast(`Server ${serverNum} is offline`, true);
        populateServerGrid(displayServers);
      }
    }

    // Show error in code box
    function showErrorInCode(message) {
      codeBox.className = 'code-box has-error';
      codeBox.innerHTML = `
        <div class="error-value">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
        </div>
      `;
      copyBtn.style.display = 'none';
      currentCode = null;
    }

    // Show generated code
    function showCode(code) {
      currentCode = code;
      codeBox.className = 'code-box has-code';
      codeBox.innerHTML = `
        <div class="code-value">
          <i class="fas fa-check-circle"></i>
          <span>${code}</span>
        </div>
      `;
      copyBtn.style.display = 'flex';
    }

    // Reset code box
    function resetCodeBox() {
      codeBox.className = 'code-box';
      codeBox.innerHTML = '<div class="code-placeholder">Your pairing code will appear here</div>';
      copyBtn.style.display = 'none';
      currentCode = null;
    }

    // Show server selection
    function showServerSelection() {
      // Reshuffle every time server selection is opened for random first server
      shuffleServerOrder();
      serverInfo.style.display = 'none';
      serverSelection.style.display = 'block';
      serverSelection.classList.add('show');
      populateServerGrid(displayServers);
    }

    // Hide server selection
    function hideServerSelection() {
      serverInfo.style.display = 'flex';
      serverSelection.style.display = 'none';
      serverSelection.classList.remove('show');
    }

    // Phone validation
    function validatePhone(number) {
      const cleaned = number.replace(/[^\d]/g, '');
      return cleaned.length >= 10 && cleaned.length <= 15;
    }

    // Generate pair code using hidden function
    async function generatePairCode(e) {
      e.preventDefault();

      if (isCooldown) {
        showToast(`Please wait ${cooldownSeconds.textContent} seconds`, true);
        return;
      }

      if (!selectedServer) {
        showErrorInCode('Please select a server first');
        showToast('Please select a server first', true);
        showServerSelection();
        return;
      }

      const phoneNumber = phoneInput.value.trim();

      if (!phoneNumber) {
        showErrorInCode('Please enter your WhatsApp number');
        showToast('Phone number is required', true);
        return;
      }

      if (!validatePhone(phoneNumber)) {
        showErrorInCode('Please enter a valid phone number (10-15 digits)');
        showToast('Invalid phone number format', true);
        return;
      }

      generateBtn.style.display = 'none';
      loading.style.display = 'block';
      resetCodeBox();

      try {
        const code = await _generateCode(selectedServer, phoneNumber.replace(/[^\d]/g, ''));

        if (code) {
          showCode(code);
          showToast('Pair code generated successfully!');
          await updateServerStatus(selectedServer);
          // Start 30 second cooldown
          startCooldown();
        } else {
          throw new Error('Failed to generate code');
        }

      } catch (error) {
        console.error('Error:', error);
        let errorMsg = error.message || 'Failed to generate code';
        showErrorInCode(errorMsg);
        showToast(errorMsg, true);
        await updateServerStatus(selectedServer);

      } finally {
        generateBtn.style.display = 'flex';
        loading.style.display = 'none';
      }
    }

    // Copy code
    async function copyCode() {
      if (!currentCode) return;

      try {
        await navigator.clipboard.writeText(currentCode);

        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.disabled = true;
        copyBtn.style.opacity = '0.7';

        showToast('Code copied to clipboard!');

        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.disabled = false;
          copyBtn.style.opacity = '1';
        }, 2000);

      } catch (error) {
        showToast('Failed to copy code', true);
      }
    }

    // Event Listeners
    form.addEventListener('submit', generatePairCode);
    copyBtn.addEventListener('click', copyCode);

    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    });

    phoneInput.addEventListener('focus', () => {
      if (codeBox.classList.contains('has-error')) {
        resetCodeBox();
      }
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', initApp);
  

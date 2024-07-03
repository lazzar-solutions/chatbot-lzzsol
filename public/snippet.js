(function() {
  // Cargar el CSS de Font Awesome
  const fontAwesomeLink = document.createElement('link');
  fontAwesomeLink.rel = 'stylesheet';
  fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
  document.head.appendChild(fontAwesomeLink);

  // Obtener el script actual y sus atributos data-*
  const script = document.currentScript;
  const color = script.getAttribute('data-color') || '#007bff';
  const title = script.getAttribute('data-title') || 'Chatbot';
  const font = script.getAttribute('data-font') || 'Arial, sans-serif';
  const icon = script.getAttribute('data-icon') || "https://lazzarcloud.com/FormularioBot/resources/icons-clients/chatbot_icon_default.png";
  const beepSound = new Audio("https://lazzarcloud.com/FormularioBot/resources/livechat.mp3"); // URL del sonido
  let soundEnabled = true;

  // Crear el botón del chatbot
  const chatbotButton = document.createElement('div');
  chatbotButton.style.position = 'fixed';
  chatbotButton.style.bottom = '20px';
  chatbotButton.style.right = '20px';
  chatbotButton.style.width = '70px'; // Cambiar tamaño predeterminado a 70px
  chatbotButton.style.height = '70px'; // Cambiar tamaño predeterminado a 70px
  chatbotButton.style.cursor = 'pointer';
  chatbotButton.style.borderRadius = '50%'; // Hacer que el botón sea circular
  chatbotButton.style.boxShadow = '0 0 15px 5px rgba(0, 255, 0, 0.5), 0 0 25px 10px rgba(0, 0, 255, 0.5), 0 0 35px 15px rgba(255, 255, 255, 0.5)'; // Sombra con colores verde, azul y blanco
  chatbotButton.innerHTML = `<img src="${icon}" alt="Chatbot Icon" style="width:100%; height:100%; border-radius:50%;">`; // Ajustar el icono dentro del botón
  document.body.appendChild(chatbotButton);

  // Crear la ventana de chat
  const chatWindow = document.createElement('div');
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '100px'; // Ajustar para que la ventana no tape al icono
  chatWindow.style.right = '20px';
  chatWindow.style.width = '300px';
  chatWindow.style.maxHeight = '400px';
  chatWindow.style.backgroundColor = 'white';
  chatWindow.style.borderRadius = '15px';
  chatWindow.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  chatWindow.style.display = 'none';
  chatWindow.style.flexDirection = 'column';
  chatWindow.style.fontFamily = font;
  chatWindow.style.transformOrigin = 'bottom right';
  chatWindow.style.transition = 'transform 0.3s ease-in-out';

  // Encabezado de la ventana de chat
  const chatHeader = document.createElement('div');
  chatHeader.style.backgroundColor = color;
  chatHeader.style.color = 'white';
  chatHeader.style.padding = '10px';
  chatHeader.style.display = 'flex';
  chatHeader.style.justifyContent = 'space-between';
  chatHeader.style.alignItems = 'center';
  chatHeader.style.borderTopLeftRadius = '15px';
  chatHeader.style.borderTopRightRadius = '15px';
  chatHeader.innerHTML = `<h2 style="margin: 0; font-size: 16px;">${title}</h2>`;
  chatWindow.appendChild(chatHeader);

  // Botón para cerrar el chat y alternar sonido
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.alignItems = 'center';

  // Botón para alternar el sonido
  const toggleSoundButton = document.createElement('button');
  toggleSoundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  toggleSoundButton.style.backgroundColor = 'transparent';
  toggleSoundButton.style.color = 'white';
  toggleSoundButton.style.border = 'none';
  toggleSoundButton.style.cursor = 'pointer';
  buttonContainer.appendChild(toggleSoundButton);

  // Botón para cerrar el chat
  const closeChatButton = document.createElement('button');
  closeChatButton.innerHTML = '<i class="fas fa-times"></i>';
  closeChatButton.style.backgroundColor = 'transparent';
  closeChatButton.style.color = 'white';
  closeChatButton.style.border = 'none';
  closeChatButton.style.cursor = 'pointer';
  buttonContainer.appendChild(closeChatButton);

  chatHeader.appendChild(buttonContainer);

  // Área de mensajes del chat
  const chatMessages = document.createElement('div');
  chatMessages.style.padding = '10px';
  chatMessages.style.flexGrow = '1';
  chatMessages.style.overflowY = 'auto';
  chatMessages.style.borderBottomLeftRadius = '15px';
  chatMessages.style.borderBottomRightRadius = '15px';
  chatWindow.appendChild(chatMessages);

  // Función para hacer scroll hacia el último mensaje
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Función para procesar el texto de respuesta
  function formatResponseText(text) {
    // Convertir subtítulos y listas
    const formattedText = text
      .replace(/\n\n/g, '<br><br>') // Dobles saltos de línea a párrafos
      .replace(/(\* .+?\n)/g, '<li>$1</li>') // Listas
      .replace(/\n/g, '<br>') // Saltos de línea a <br>
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Negrita
      .replace(/\*([^*]+)\*/g, '<em>$1</em>'); // Cursiva

    return formattedText;
  }

  // Formulario de entrada de mensajes
  const chatForm = document.createElement('form');
  chatForm.style.display = 'flex';
  chatForm.style.borderTop = '1px solid #ccc';
  chatForm.innerHTML = `
    <input type="text" id="message" name="message" autocomplete="off" placeholder="Enter your message..." style="flex-grow: 1; padding: 10px; border: none; border-right: 1px solid #ccc; border-bottom-left-radius: 15px;">
    <button type="submit" style="padding: 10px; background-color: ${color}; color: white; border: none; cursor: pointer; border-bottom-right-radius: 15px;">
      <i class="fas fa-paper-plane"></i>
    </button>
  `;
  chatWindow.appendChild(chatForm);

  // Identidad en la parte inferior
  const footer = document.createElement('div');
  footer.style.textAlign = 'left';
  footer.style.padding = '5px 10px';
  footer.style.fontSize = '10px';
  footer.style.color = 'darkgray';
  footer.style.fontStyle = 'italic';
  footer.innerHTML = `<a href="https://www.lzzsol.com" target="_blank" style="color: darkgray; text-decoration: none;">Desarrollado por Lazzar Solutions</a>`;
  chatWindow.appendChild(footer);

  document.body.appendChild(chatWindow);

  // Variable para rastrear si el chatbot ha sido abierto antes
  let isChatOpenedBefore = false;

  // Mostrar o esconder la ventana de chat al hacer clic en el botón del chatbot
  chatbotButton.addEventListener('click', () => {
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
      chatWindow.style.display = 'flex';
      setTimeout(() => {
        chatWindow.style.transform = 'scale(1)';
      }, 0); // Asegurar que la transición ocurra después de que se muestre el chat
      scrollToBottom(); // Asegurarse de que la ventana esté en la parte inferior al abrirla

      // Enviar un mensaje de bienvenida predeterminado si es la primera vez que se abre el chat
      if (!isChatOpenedBefore) {
        const welcomeMessage = "Hola, ¿en qué puedo ayudarte hoy?";
        const botMessageElement = document.createElement('div');
        botMessageElement.style.display = 'flex';
        botMessageElement.style.justifyContent = 'flex-start';
        botMessageElement.innerHTML = `<div style="background-color: #f1f1f1; color: black; padding: 10px; border-radius: 10px; margin: 5px 0; max-width: 70%; font-size: 75%; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">${formatResponseText(welcomeMessage)}</div>`;
        chatMessages.appendChild(botMessageElement);
        setTimeout(() => {
          botMessageElement.firstChild.style.opacity = '1';
          botMessageElement.firstChild.style.transform = 'translateY(0)';
        }, 0);
        scrollToBottom(); // Desplazarse hacia el último mensaje

        isChatOpenedBefore = true; // Actualizar el estado de apertura
      }
    } else {
      chatWindow.style.transform = 'scale(0)';
      setTimeout(() => {
        chatWindow.style.display = 'none';
      }, 300); // Tiempo de la transición para ocultar el chat
    }
  });

  // Cerrar la ventana de chat al hacer clic en el botón de cerrar
  closeChatButton.addEventListener('click', () => {
    chatWindow.style.transform = 'scale(0)';
    setTimeout(() => {
      chatWindow.style.display = 'none';
    }, 300); // Tiempo de la transición para ocultar el chat
  });

  // Alternar el sonido al hacer clic en el botón de sonido
  toggleSoundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleSoundButton.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
  });

  // Manejar el envío de mensajes
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const userMessage = messageInput.value;

    if (userMessage.trim() === '') return;

    // Añadir el mensaje del usuario al chat
    const userMessageElement = document.createElement('div');
    userMessageElement.style.display = 'flex';
    userMessageElement.style.justifyContent = 'flex-end';
    userMessageElement.innerHTML = `<div style="background-color: ${color}; color: white; padding: 10px; border-radius: 10px; margin: 5px 0; max-width: 70%; font-size: 75%; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">${userMessage}</div>`;
    chatMessages.appendChild(userMessageElement);
    setTimeout(() => {
      userMessageElement.firstChild.style.opacity = '1';
      userMessageElement.firstChild.style.transform = 'translateY(0)';
    }, 0);
    scrollToBottom(); // Desplazarse hacia el último mensaje

    // Limpiar el campo de entrada
    messageInput.value = '';

    // Enviar el mensaje al servidor
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botMessage = data.response;

    // Añadir la respuesta del bot al chat
    const botMessageElement = document.createElement('div');
    botMessageElement.style.display = 'flex';
    botMessageElement.style.justifyContent = 'flex-start';
    botMessageElement.innerHTML = `<div style="background-color: #f1f1f1; color: black; padding: 10px; border-radius: 10px; margin: 5px 0; max-width: 70%; font-size: 75%; opacity: 0; transform: translateY(20px); transition: all 0.3s ease;">${formatResponseText(botMessage)}</div>`;
    chatMessages.appendChild(botMessageElement);
    setTimeout(() => {
      botMessageElement.firstChild.style.opacity = '1';
      botMessageElement.firstChild.style.transform = 'translateY(0)';
    }, 0);
    scrollToBottom(); // Desplazarse hacia el último mensaje

    // Reproducir el sonido del bot si está habilitado
    if (soundEnabled) {
      beepSound.play();
    }
  });
})();

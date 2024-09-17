Hooks.once('init', async function() {

});

Hooks.on("ready", () => {
    console.log("Worldbuilding Item Description module is ready.");
  
    // Функция для отправки описания предмета в чат
    function sendItemDescriptionToChat(item) {
      let description = item.system.description || "";
      let chatMessage = `${item.name}`;
      ChatMessage.create({
        content: chatMessage,
        flavor: "Хочет использовать:",
        speaker: ChatMessage.getSpeaker()
      });
    }
  
    // Добавляем кнопку рядом с каждым предметом в списке
    function addButtonToItemList(html, actor) {
      html.find('.sheet-body .item').each((index, element) => {
        const itemId = $(element).data("item-id");
        const itemControls = $(element).find('.item-controls');
  
        // Создаем кнопку с иконкой
        const button = $('<a class="item-control" title="Отправить в чат"><i class="fas fa-comments"></i></a>');
        
        // Добавляем событие клика для кнопки
        button.click(async (event) => {
          event.preventDefault();
          const item = actor.getEmbeddedDocument("Item", itemId);
          sendItemDescriptionToChat(item);
        });
  
        // Вставляем кнопку внутрь блока item-controls
        itemControls.prepend(button);
      });
    }
  
    // Добавляем кнопку при рендеринге листа персонажа
    Hooks.on("renderActorSheet", (sheet, html, data) => {
      const actor = sheet.actor;
      addButtonToItemList(html, actor);
    });
});
  
Hooks.on("renderChatMessage", (message, html, data) => {
    let speaker = ChatMessage.getSpeaker({ actor: message.author.character });
    // console.log(message);
  
    // Если нет данных о спикере, выходим
    if (!speaker)
      return;
  
    let avatar = "";  // Переменная для хранения пути к изображению
    let actorName = ""; // Имя персонажа
  
    // Если токена нет, используем актёра, связанного с пользователем
    if (speaker.actor) {
      const actor = game.actors.get(speaker.actor);
      if (actor) {
        avatar = actor.img; // Используем изображение персонажа
        actorName = actor.name; // Используем имя персонажа
      }
    }
  
    if (actorName !== "")
    {
      // Заменяем имя персонажа или выводим имя игрока
      html.find(".message-sender").text(actorName);
    }
    if (avatar !== "")
      {
      // Добавляем аватарку в чат
      const img = $(`<img class="chat-avatar" src="${avatar}" width="36" height="36" style="border-radius: 50%;">`);
      html.find(".message-sender").prepend(img);
      html.find('.message-sender').css('margin-bottom', '6px');
      }
});
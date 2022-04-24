/* eslint-disable no-alert */

function updateCoffeeView(coffeeQty) {
  const coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  const coffeeCounter = document.getElementById('coffee_counter');
  data.coffee++;
  coffeeCounter.innerText = data.coffee;
  renderProducers(data);
}

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producerElement) => {
    if (coffeeCount >= producerElement.price / 2) {
      producerElement.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter(
    (producerElement) => producerElement.unlocked === true
  );
}

function makeDisplayNameFromId(id) {
  const idArrOfWords = id.split('_');
  return idArrOfWords
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${producer.price} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let coffeeProducerContainer = document.getElementById('producer_container');
  deleteAllChildNodes(coffeeProducerContainer);
  unlockProducers(data.producers, data.coffee);

  let arrayOfUnlockedProducers = getUnlockedProducers(data);
  arrayOfUnlockedProducers.forEach((producerElement) =>
    coffeeProducerContainer.appendChild(makeProducerDiv(producerElement))
  );
}

function getProducerById(data, producerId) {
  return data.producers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  if (getProducerById(data, producerId).price <= data.coffee) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  let cpsDisplay = document.getElementById('cps');
  cpsDisplay.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(+oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    let producerInQuestion = getProducerById(data, producerId);

    data.totalCPS += producerInQuestion.cps;
    data.coffee = data.coffee - producerInQuestion.price;

    producerInQuestion.qty++;
    producerInQuestion.price = updatePrice(producerInQuestion.price);
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  const target = event.target;

  if (target.tagName !== 'BUTTON' || !target.id) {
    return;
  }

  const producerIDClicked = target.id.slice(4);

  if (canAffordProducer(data, producerIDClicked)) {
    attemptToBuyProducer(data, producerIDClicked);
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    return;
  }

  window.alert('Not enough coffee!');
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

function changeStartMessage() {
  const messageToUsers = document.getElementById('message-to-users');
  messageToUsers.innerText = 'Keep Clicking!  Click Your Heart Out!';
}

if (typeof process === 'undefined') {
  const data = window.data;
  const bigCoffee = document.getElementById('big_coffee');
  const producerContainer = document.getElementById('producer_container');

  bigCoffee.addEventListener('click', () => {
    clickCoffee(data);
    changeStartMessage();
  });

  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

  setInterval(() => tick(data), 1000);
} else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}

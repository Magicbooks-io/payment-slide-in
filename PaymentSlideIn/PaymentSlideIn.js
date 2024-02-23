class PaymentSlideIn extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
    :host {
      position: fixed;
      top: 0;
      right: -400px; /* Start off screen */
      width: 400px;
      height: 100vh;
      background-color: white;
      transition: right 0.3s ease-in-out; /* Add transition for smooth sliding */
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      overflow: auto;
      max-width:100vw;
    }
    
    /* Add a class to transition to visible position */
    :host(.show) {
      right: 0;
    }

    
    
    .open-btn{
      position: fixed;
    top: 15px;
    right: 15px;
    cursor: pointer;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    background-color: rgb(79, 87, 202);
    border: none;
    display: none;
    align-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    }

    .hide{
      display:none;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      border-radius: 100%;
      width: 40px;
      height: 40px;
      background-color: transparent;
      border: none;
      

  }
      #checkout {
        width: 100%;
        height: 100%;
      }
    `;
    const paysheet = document.createElement('div');
    paysheet.innerHTML = `
      <div>
        <!-- Your embedded paysheet content goes here -->
        <div id="checkout"></div>
      </div>
    `;
    const closeButton = document.createElement('button');
    
    closeButton.innerHTML = `<img src="/PaymentSlideIn/exit.svg" alt="close-sheet" style="width:24px;height:24px;">`;
    
    const openButton = document.createElement('button');
    openButton.innerHTML = `<div dir="auto" class="css-901oao r-lrvibr" style="border-width: 0px; color: rgb(255, 255, 255); font-family: FontAwesome; font-size: 20px; font-style: normal; font-weight: normal;"></div>`;
    openButton.classList.add('open-btn');
    
    closeButton.classList.add('close-btn');
    closeButton.addEventListener('click', () => {
      this.classList.remove('show');
      openButton.style.display = 'flex';
    });    

    openButton.addEventListener('click', () => {
      this.classList.add('show');
      openButton.style.display = 'none';
    });
    shadow.append(style, paysheet, closeButton, openButton);
  }

  connectedCallback() {
    const clientSecret = this.getAttribute('client-secret');
    this.renderPaymentForm(clientSecret);
    // Show the element
    this.classList.add('show');
  }

  renderPaymentForm(clientSecret) {
    if (!clientSecret) return;
    
    const stripe = Stripe("pk_live_51LGNXDAtS3kafppOP02r7sSYgKF5DV4ZDopP7J2kac0CNSTCBXGgOuVRvQsaVTUdxI3GrX1GLllOfAujFlLVWohn00NaFwDikp");
    const checkoutDiv = this.shadowRoot.querySelector('#checkout');

    stripe.initEmbeddedCheckout({
      clientSecret,
    }).then((checkout) => {
      checkout.mount(checkoutDiv);
    });
  }
}

customElements.define('payment-slide-in', PaymentSlideIn);

import * as QRCode from "@bitjson/qr-code";
import { QRCodeAnimation } from "@bitjson/qr-code/dist/types/components/qr-code/animations";
import { ASSETS } from "./assets";

const html = String.raw;

const STYLE = {
  m: {
    grid: 27,
  },
  theme: {
    primary: [143, 221, 255],
    secondary: [10, 73, 127],
    tertiary: [25, 135, 183],
  },
};

export class CasaConnettiPrompt extends HTMLElement {
  private pairingUri: string | null = null;

  static get observedAttributes() {
    return ["pairing-uri"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    QRCode.defineCustomElements(window);
    this.render();
    this.setupCloseButton();

    setTimeout(() => {
      const container = this.shadowRoot?.getElementById(
        "casa-famiglia-container"
      );
      if (container) {
        container.style.opacity = "1";
      }
    }, 0);

    this.animateQRCode();
  }

  attributeChangedCallback(name: string, previous: string, next: string) {
    if (name === "pairing-uri" && previous !== next) {
      this.pairingUri = next;
      this.render();
      this.animateQRCode();
    }
  }

  private setupCloseButton() {
    const closeButton = this.shadowRoot?.querySelector(".close");
    closeButton?.removeEventListener("click", this.handleCloseClick);
    closeButton?.addEventListener("click", this.handleCloseClick.bind(this));
  }

  private handleCloseClick() {
    const asideElement = this.shadowRoot?.querySelector("aside");
    if (asideElement) {
      asideElement.style.animation =
        "slideOutDown 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards";
      asideElement.addEventListener("animationend", () => {
        this.remove();
      });
    }
  }

  private isMobileDevice(): boolean {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  animateQRCode() {
    const qrCode = this.shadowRoot?.querySelector("qr-code");
    if (qrCode) {
      // event: codeRendered
      qrCode.addEventListener("pointerdown", () => {
        qrCode.animateQRCode("FadeInTopDown" as unknown as QRCodeAnimation);
      });
    }
  }

  render() {
    if (this.shadowRoot) {
      const isMobile = this.isMobileDevice();
      this.shadowRoot.innerHTML = html`
        <style scoped>
          :host {
            font-family: ui-sans-serif, system-ui, sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }

          @keyframes slideInUp {
            0% {
              transform: translateY(10vh);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOutDown {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(10vh);
              opacity: 0;
            }
          }
          #casa-famiglia-container {
            opacity: 1;

            background-image: radial-gradient(
                circle,
                rgba(255, 255, 255, 0) 40%,
                rgba(255, 255, 255, 0.5) 10%,
                rgba(255, 255, 255, 0.95) 90%
              ),
              linear-gradient(
                rgba(${STYLE.theme.primary.join(",")}, 0.75) 1px,
                transparent 1px
              ),
              linear-gradient(
                to right,
                rgba(${STYLE.theme.primary.join(",")}, 0.75) 1px,
                #ffffff 1px
              );

            background-size: cover, ${STYLE.m.grid}px ${STYLE.m.grid}px,
              ${STYLE.m.grid}px ${STYLE.m.grid}px;

            background-position: center, 0 0, 0 0;

            border: 1px solid rgba(${STYLE.theme.tertiary.join(",")}, 0.5);
            position: fixed;
            bottom: 20px;
            right: 20px;
            min-width: 320px;
            z-index: 9999;
            animation: slideInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            padding: 1rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }

          header {
            margin: 10px 10px 10px 10px;
          }
          h3 {
            margin: 0;
            padding: 0;
            font-size: 1.35em;
            color: rgba(${STYLE.theme.tertiary.join(",")}, 1);
          }

          footer {
            margin: 10px 10px 10px 10px;
          }
          small {
            font-size: 0.675em;
          }
          small,
          small a {
            color: rgba(${STYLE.theme.tertiary.join(",")}, 1);
          }
          #qr-container {
            margin: 0;
            margin-right: -5px !important;
            padding: 0;
          }
          #casa-famiglia-close {
            position: absolute;
            top: 28px;
            right: 30px;
            cursor: pointer;
            background: transparent;
            padding: 0;
            margin: 0;
            border: none;
          }
          #casa-famiglia-close svg {
            padding: 0;
            margin: 0;
          }

          qr-code {
            background-color: rgba(255, 255, 255, 1);
            margin: 0;
            padding: 0;
            border: none !important;
          }

          #casa-famiglia-launch-link {
            border: 1px solid rgba(${STYLE.theme.tertiary.join(",")}, 0.95);
            background: rgba(${STYLE.theme.tertiary.join(",")}, 0.95);
            margin: 10px;
            font-size: 1.25rem;
            font-weight: 600;
            padding: 10px 40px;
            border-radius: 10px;
            color: white;
          }

          .is-mobile {
            h3 {
            }
            #casa-famiglia-container {
              padding: 0;
            }
            #casa-famiglia-description {
              text-align: center;
              margin: 2rem;
            }
          }
        </style>
        <aside
          id="casa-famiglia-container"
          class="${isMobile && `is-mobile`}"
          role="dialog"
          aria-labelledby="casa-famiglia-code-header"
          aria-describedby="casa-famiglia-description"
        >
          <header id="casa-famiglia-code-header">
            <h3>Casa Connetti</h3>
            <button id="casa-famiglia-close">
              ${ASSETS.CLOSE({
                color: `rgba(${STYLE.theme.tertiary.join(",")}, .75)`,
                size: 26,
              })}
            </button>
          </header>
          <section id="casa-famiglia-description">
            ${isMobile
              ? `<button id="casa-famiglia-launch-link" onclick="window.location.href='casa://${this.pairingUri}'">Open in Casa</button>`
              : this.pairingUri
              ? `
              <qr-code 
                role="img" 
                aria-label="Casa Connetti QR code" 
                contents="${this.pairingUri}"
                module-color="rgba(${STYLE.theme.tertiary.join(",")}, 1)"
                position-ring-color="rgba(${STYLE.theme.tertiary.join(",")}, 1)"
                position-center-color="rgba(${STYLE.theme.tertiary.join(
                  ","
                )}, 1)"
              >
                <img src="${ASSETS.ICON(
                  `rgb(${STYLE.theme.tertiary.join(",")})`
                )}" slot="icon" width="100%" />
              </qr-code>
            `
              : ""}
          </section>
          <footer>
            <small>
              <a href="http://famiglia.casa/" target="_blank">
                0.1.0-alpha.1
              </a>
            </small>
          </footer>
        </aside>
      `;
    }
  }
}

customElements.define("casa-connetti-prompt", CasaConnettiPrompt);

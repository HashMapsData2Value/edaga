import * as QRCode from "@bitjson/qr-code";
import { QRCodeAnimation } from "@bitjson/qr-code/dist/types/components/qr-code/animations";
import { ASSETS } from "./assets";

const html = String.raw;

const STYLE = {
  m: {
    grid: 27,
    indicator: 22,
  },
  theme: {
    primary: [143, 221, 255],
    secondary: [10, 73, 127],
    tertiary: [25, 135, 183],
  },
};

export class CasaConnettiPrompt extends HTMLElement {
  private pairingUri: string | null = null;
  private hasRendered = false;

  static get observedAttributes() {
    return ["pairing-uri"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!this.hasRendered) {
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

      if (this.isMobileDevice() && this.pairingUri) {
        this.attemptOpenCasaApp();
      }

      this.stopClickPropagation();

      this.animateQRCode();
      this.hasRendered = true;
    }
  }

  private stopClickPropagation() {
    this.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
  }

  private attemptOpenCasaApp() {
    const launchButton = this.shadowRoot?.querySelector(
      "#casa-famiglia-launch-link .label"
    ) as HTMLSpanElement;
    const loadingIndicator = this.shadowRoot?.querySelector(
      "#casa-famiglia-launch-link .loading-indicator"
    ) as HTMLElement;

    if (launchButton && loadingIndicator) {
      launchButton.textContent = "Opening Casa...";
      loadingIndicator.style.display = "inline";

      // Attempt to open the Casa
      window.location.href = `casa://${this.pairingUri}`;

      setTimeout(() => {
        if (document.visibilityState === "visible") {
          launchButton.textContent = "Open in Casa";
          loadingIndicator.style.display = "none";
        }
      }, 15000);
    }
  }

  attributeChangedCallback(name: string, previous: string, next: string) {
    if (name === "pairing-uri" && previous !== next) {
      this.pairingUri = next;
      this.render();
      this.animateQRCode();
    }
  }

  private setupCloseButton() {
    const closeButton = this.shadowRoot?.querySelector("#casa-famiglia-close");
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
    return /Android|iPhone/i.test(navigator.userAgent);
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
          aside#casa-famiglia-container {
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
            // padding: 1rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;

            &::after {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: linear-gradient(
                180deg,
                rgba(143, 221, 255, 0.175) 5%,
                rgba(29, 152, 253, 0.05) 17.5%,
                rgba(255, 255, 255, 0) 100%
              );
              pointer-events: none;
            }

            header {
              padding: 1rem 1rem 1.5rem 1rem;
            }

            h3 {
              margin: 0;
              padding: 0;
              font-size: 1.35rem;
              color: rgba(${STYLE.theme.tertiary.join(",")}, 1);
              /*-webkit-text-stroke: 0.005px
                rgba(${STYLE.theme.secondary.join(
                ","
              )}, 0.15);
              text-shadow: 0 0.05px 0.005px
                rgba(${STYLE.theme.secondary.join(
                ","
              )}, 1);*/
              user-select: none;
            }

            .sub-title {
              color: rgba(${STYLE.theme.tertiary.join(",")}, 0.75);
              font-size: 0.95rem;
              user-select: none;
            }

            footer {
              padding: 1.5rem 1rem 1rem 1rem;
            }
            small {
              font-size: 0.675em;
            }
            small,
            small a {
              color: rgba(${STYLE.theme.tertiary.join(",")}, 1);
            }
            #qr-container {
              margin: -15px -19px -25px -15px;
            }
            #casa-famiglia-close {
              position: absolute;
              top: 16px;
              right: 16px;
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

            #casa-famiglia-description {
              opacity: 0.95;
            }

            qr-code {
              background-color: rgba(255, 255, 255, 1);
              /* background-color: rgba(255, 255, 0, 1); */
              margin: 0;
              padding: 0;
              border: 1px solid rgba(${STYLE.theme.tertiary.join(",")}, 0.15);
              border-right: 0;
              border-left: 0;
              border-radius: 3px;
              padding-left: 6px;
              padding-top: 6px;
              padding-right: 2px;
              user-select: none;
            }

            [data-style-tag="qr-code"] {
              border: 1px solid magenta;
            }

            #qr-container > div > svg {
              border: 1px solid magenta;
            }
          }

          aside#casa-famiglia-container.is-mobile {
            width: calc(100% - (18px * 2));
            width: calc(100% - 2px - (10px * 2));
            bottom: 10px;
            right: 10px;

            &::after {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: linear-gradient(
                180deg,
                rgba(143, 221, 255, 0.15) 0%,
                rgba(29, 152, 253, 0.05) 40%,
                rgba(255, 255, 255, 0) 100%
              );
              pointer-events: none;
            }

            header {
              padding: 16px;
            }
            h3 {
              font-size: 1.65rem;
            }
            #casa-famiglia-container {
              padding: 0;
            }
            #casa-famiglia-description {
              text-align: center;
              margin: 1rem;
            }
            #casa-famiglia-launch-link {
              border: 1px solid rgba(${STYLE.theme.tertiary.join(",")}, 0.95);
              background: rgba(${STYLE.theme.tertiary.join(",")}, 0.95);
              font-size: 1.25rem;
              font-weight: 600;
              padding: 14px 12px;
              width: 100%;
              border-radius: 10px;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;

              box-shadow: 0 0.05px 0.015px
                rgba(${STYLE.theme.secondary.join(",")}, 1);

              span {
                display: block;
              }
              .label {
                margin-right: 0.5rem;
              }
              .loading-indicator {
                margin-left: 0.5rem;
                display: none;
              }
            }
            footer {
              padding: 1.15rem 1rem 1rem 1rem;
            }
          }
        </style>
        <aside
          id="casa-famiglia-container"
          class="${isMobile ? "is-mobile" : ""}"
          role="dialog"
          aria-labelledby="casa-famiglia-code-header"
          aria-describedby="casa-famiglia-description"
        >
          <header id="casa-famiglia-code-header">
            <h3 data-text="Casa Connetti">Casa Connetti</h3>
            ${!isMobile
              ? `<span class="sub-title">Scan with Casa to connect</span>`
              : ""}
            <button id="casa-famiglia-close">
              ${ASSETS.CLOSE({
                color: `rgba(${STYLE.theme.tertiary.join(",")}, .75)`,
                size: 26,
              })}
            </button>
          </header>
          <section id="casa-famiglia-description">
            ${isMobile
              ? `<button id="casa-famiglia-launch-link">
                  <span class="label">Open in Casa</span>
                  <span class="loading-indicator" style="width: ${
                    STYLE.m.indicator
                  }px; height: ${STYLE.m.indicator}px;">
                  ${ASSETS.LOADING({
                    size: STYLE.m.indicator,
                    color: "rgba(255,255,255,1)",
                  })}
                  </span>
                </button>`
              : this.pairingUri
              ? `
            <qr-code 
              role="img" 
              aria-label="Casa Connetti QR code" 
              contents="${this.pairingUri}"
              module-color="rgba(${STYLE.theme.tertiary.join(",")}, 1)"
              position-ring-color="rgba(${STYLE.theme.tertiary.join(",")}, 1)"
              position-center-color="rgba(${STYLE.theme.tertiary.join(",")}, 1)"
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

      this.setupCloseButton();

      if (isMobile && this.pairingUri) this.attemptOpenCasaApp();
    }
  }
}

customElements.define("casa-connetti-prompt", CasaConnettiPrompt);

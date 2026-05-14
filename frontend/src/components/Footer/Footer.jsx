import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <h3 className="brand-title">QuickDrive</h3>
          <p className="brand-sub">Convenient car rentals, anytime.</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/vehicles">Vehicles</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="link-group">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/help">Help Center</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/terms">Terms</a>
              </li>
              <li>
                <a href="/privacy">Privacy</a>
              </li>
            </ul>
          </div>

          <div className="newsletter">
            <h4>Get updates</h4>
            <p>Subscribe for deals & new vehicles.</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" placeholder="Your email" aria-label="Email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright">
            © {new Date().getFullYear()} QuickDrive. All rights reserved.
          </p>

          <div className="socials">
            <a
              href="#"
              aria-label="Twitter"
              className="social-icon"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.1 1.53-1.9-.68.4-1.43.7-2.23.86A3.49 3.49 0 0016.5 4c-1.93 0-3.5 1.66-3.5 3.7 0 .29.03.57.1.84-2.9-.14-5.48-1.6-7.2-3.83-.3.5-.47 1.08-.47 1.7 0 1.17.6 2.2 1.53 2.8-.56-.02-1.08-.17-1.54-.43v.04c0 1.77 1.27 3.25 2.96 3.58-.31.08-.63.12-.96.12-.24 0-.48-.02-.71-.07.48 1.5 1.86 2.6 3.5 2.63A7.02 7.02 0 014 19.54a9.9 9.9 0 005.36 1.56c6.43 0 9.95-5.6 9.95-10.46v-.48c.68-.48 1.26-1.08 1.72-1.76-.62.28-1.28.47-1.96.55z"/></svg>`,
              }}
            ></a>
            <a
              href="#"
              aria-label="Facebook"
              className="social-icon"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.03H7.9v-2.9h2.55V9.41c0-2.52 1.5-3.9 3.8-3.9 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.8l-.45 2.9h-2.35v7.03C18.34 21.19 22 17.06 22 12.07z"/></svg>`,
              }}
            ></a>
            <a
              href="#"
              aria-label="Instagram"
              className="social-icon"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-3.2c1.1 0 1.24.01 1.68.02.43.01.72.09.89.15.22.08.38.18.55.34.17.17.26.33.34.55.06.17.14.46.15.89.01.44.02.58.02 1.68s-.01 1.24-.02 1.68c-.01.43-.09.72-.15.89-.08.22-.18.38-.34.55-.17.17-.33.26-.55.34-.17.06-.46.14-.89.15-.44.01-.58.02-1.68.02s-1.24-.01-1.68-.02c-.43-.01-.72-.09-.89-.15a1.8 1.8 0 01-.55-.34 1.8 1.8 0 01-.34-.55c-.06-.17-.14-.46-.15-.89-.01-.44-.02-.58-.02-1.68s.01-1.24.02-1.68c.01-.43.09-.72.15-.89.08-.22.18-.38.34-.55.17-.17.33-.26.55-.34.17-.06.46-.14.89-.15.44-.01.58-.02 1.68-.02zM18.4 4.6h-2.1c-.2 0-.4.1-.5.2-.2.2-.3.4-.3.6v2.1c0 .2.1.4.3.6.2.2.4.2.6.2h2.1c.2 0 .4-.1.6-.3.2-.2.2-.4.2-.6v-2.1c0-.2-.1-.4-.3-.6-.2-.2-.4-.2-.6-.2zM12 2C8.1 2 5 5.1 5 9s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z"/></svg>`,
              }}
            ></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

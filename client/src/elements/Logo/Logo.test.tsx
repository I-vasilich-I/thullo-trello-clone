import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
  it('renders logo unchanged', () => {
    const { container } = render(<Logo />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          href="/"
        >
          <span
            style="box-sizing: border-box; display: inline-block; overflow: hidden; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"
          >
            <span
              style="box-sizing: border-box; display: block; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"
            >
              <img
                alt=""
                aria-hidden="true"
                src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2798%27%20height=%2729%27/%3e"
                style="display: block; max-width: 100%; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"
              />
            </span>
            <img
              alt="logo"
              data-nimg="intrinsic"
              decoding="async"
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              style="position: absolute; top: 0px; left: 0px; bottom: 0px; right: 0px; box-sizing: border-box; padding: 0px; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            />
            <noscript />
          </span>
        </a>
      </div>
    `);
  });
});

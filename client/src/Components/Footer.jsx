import React from "react";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer className="block py-4">
        <div className="container px-4 mx-auto">
          <hr className="border-gray-200 mb-4 border-b-1" />
          <div className="flex flex-wrap items-center justify-center md:justify-between">
            <div className="w-full px-4 md:w-4/12">
              <div className="py-1 font-semibold justify-right text-sm text-gray-900">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://vitomilix.io"
                  className="py-1 font-semibold justify-right text-sm text-gray-900"
                >
                  Vitomilix. All rights reserved
                </a>
              </div>
            </div>
            <div className="w-full px-4 md:w-8/12">
              <ul className="flex flex-wrap list-none justify-center md:justify-end"></ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

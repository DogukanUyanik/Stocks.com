import StockDataWindow from "../../components/StockDataWindow";

export default function Home() {
  return (
    <div style={{ paddingTop: '10px' }}>
      <div className="container">
        <div className="row" style={{ marginTop: '75px' }}>
          <div className="col-12 col-md-8">
            <h1 style={{ fontSize: '65px', color: '#28a745' }}>
              Invest Smart, <br /> Trade Confidently
            </h1>
            <p>
              Buy and trade top stocks like Apple, Google, and more with just a few clicks.
              <br />
              Build your portfolio and master the market.
            </p>

            <div className="mt-5">
              <h2>Why mock trading?</h2>
              <p>
                Mock trading offers a unique opportunity to engage with the stock market without any financial risk. 
                By using virtual funds, you can practice and refine your trading strategies, learn how to navigate market trends, and test out various investment approaches.
                Whether you're new to investing or an experienced trader, mock trading provides a safe environment to experiment,
                make mistakes, and build confidence.
                Gain valuable insights into market behavior and boost your decision-making skills—all without the pressure of real-world consequences.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <StockDataWindow />
          </div>
        </div>

        <div className="row mt-5 mb-5">
          <div className="col-12">
            <h2 className="text-center mb-4">What Our Users Are Saying</h2>
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="border p-4 rounded shadow-sm">
                  <p>
                    "This platform has completely changed the way I understand the stock market. The mock trading feature gave me the confidence to invest without the fear of losing real money. It's fun, educational, and easy to use!"
                  </p>
                  <p className="text-muted text-end">- Bilal Z.</p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border p-4 rounded shadow-sm">
                  <p>
                    "As someone new to trading, I was always intimidated by the stock market. With this platform, I learned how to build a portfolio and understand price movements. The interface is intuitive, and the live updates are amazing!"
                  </p>
                  <p className="text-muted text-end">- Anis B.</p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border p-4 rounded shadow-sm">
                  <p>
                    "I love the gamified approach! The insights I gained here helped me make smarter decisions when I started real trading. Definitely a great first step before getting into the real world, way less risk and way more fun."
                  </p>
                  <p className="text-muted text-end">- Arman S.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

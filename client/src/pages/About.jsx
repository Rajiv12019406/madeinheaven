export function About() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>About our practice</h1>
          <p>
            We combine disciplined legal analysis with practical judgment—helping individuals and organizations make
            better decisions under pressure.
          </p>
        </div>
      </div>
      <section className="page-section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card">
            <h2>Our approach</h2>
            <p>
              Every engagement begins with listening. We document objectives, constraints, and timelines, then map
              options with plain-language tradeoffs. Where litigation is avoidable, we pursue efficient resolutions;
              where it is not, we prepare meticulously.
            </p>
            <h2>Values</h2>
            <p>
              Confidentiality, candor, and respect for your time. Our digital workflows—including secure consultation
              booking and payment—reduce friction so we can focus on substance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

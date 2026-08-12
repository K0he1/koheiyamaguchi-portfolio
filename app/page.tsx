const projects = [
  {
    name: "日本の営業日カウンター",
    description: "祝日と有給休暇を考慮して、任意の月の営業日数を計算するWebアプリ。",
    stack: "Next.js / TypeScript / Azure Static Web Apps",
    url: "https://thankful-meadow-02df09f00.7.azurestaticapps.net",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="#top">Kohei Yamaguchi</a>
        <nav aria-label="メインナビゲーション">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">SOFTWARE / CLOUD / LEARNING</p>
        <h1>つくりながら、<br />仕組みを理解する。</h1>
        <p className="hero-copy">
          Webアプリケーションとクラウドインフラを学びながら、実際に動くものを作っています。
        </p>
        <div className="hero-links">
          <a className="button button-primary" href="#projects">制作物を見る</a>
          <a className="button button-secondary" href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHubへ</a>
        </div>
      </section>

      <section className="section" id="about">
        <p className="eyebrow">ABOUT</p>
        <h2>プロフィール</h2>
        <p className="section-copy">
          要件定義から設計、実装、テスト、デプロイまでの流れを一つずつ経験しながら、
          Next.js、TypeScript、Azure、Terraformなどを使った開発に取り組んでいます。
        </p>
      </section>

      <section className="section" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROJECTS</p>
            <h2>制作物</h2>
          </div>
          <span className="project-count">{projects.length} project</span>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-card-top">
                <span className="project-number">01</span>
                <span className="project-status">LIVE</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="project-stack">{project.stack}</span>
              <a className="project-link" href={project.url} target="_blank" rel="noreferrer">サイトを見る ↗</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Kohei Yamaguchi</span>
        <a href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHub ↗</a>
      </footer>
    </main>
  );
}

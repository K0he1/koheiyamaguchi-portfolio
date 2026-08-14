import Image from "next/image";
import ContactForm from "./contact-form";

const projects = [
  {
    name: "日本の営業日カウンター",
    description: "祝日と有給休暇を考慮して，任意の月の営業日数を計算するWebアプリ．",
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
          <a href="#contact">Contact</a>
          <a href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/kohei-yamaguchi-06429827a/" target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-layout">
          <div className="hero-content">
            <p className="eyebrow">SOFTWARE / CLOUD / LEARNING</p>
            <h1>K&apos;s Home Page</h1>
            <p className="hero-copy">
              K&apos;s Home Pageは、プロフィールや制作物を紹介し、お問い合わせを受け付けるポートフォリオサイトです。
              PwC JapanでSoftware Developerとして働きながら，GenAIを活用したWebアプリを作っています．
              個人では，FXや先物のクオンツトレードにも取り組んでいます．
            </p>
            <div className="hero-links">
              <a className="button button-primary" href="#projects">Portfolio</a>
              <a className="button button-secondary" href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHub</a>
              <a className="button button-secondary" href="https://www.linkedin.com/in/kohei-yamaguchi-06429827a/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <figure className="hero-cat">
            <Image src="/cat.png" alt="こちらを見る猫" width={1254} height={1254} priority />
          </figure>
        </div>
      </section>

      <section className="section" id="about">
        <p className="eyebrow">ABOUT</p>
        <h2>Profile</h2>
        <p className="section-copy">
          AIを活用したアプリケーションを作っています．要件定義から設計，実装，
          テスト，クラウドへのデプロイなどをやっています．また，それらが実際にユーザーの課題解決や業務効率化に繋がることを意識しています．

          これまでData Scientistとして統計・データ分析に携わり，現在はSoftware Developerとして
          Python，TypeScript，Azureなどを使った開発に取り組んでいます．個人ではFX・先物の
          クオンツトレードを実践し，データとアルゴリズムを使った意思決定にも関心があります．
        </p>
        <dl className="profile-facts">
          <div>
            <dt>現在</dt>
            <dd>PwC Japan / Software Developer</dd>
          </div>
          <div>
            <dt>学歴</dt>
            <dd>京都大学大学院・明治大学</dd>
          </div>
          <div>
            <dt>関心領域</dt>
            <dd>Webアプリケーション，GenAI，クラウド，データ活用</dd>
          </div>
          <div>
            <dt>個人活動</dt>
            <dd>FX・先物のクオンツトレード</dd>
          </div>
        </dl>
      </section>

      <section className="section" id="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PROJECTS</p>
            <h2>Portfolio</h2>
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

      <section className="section" id="contact">
        <p className="eyebrow">CONTACT</p>
        <h2>Contact</h2>
        <p className="section-copy">
          仕事の依頼や制作物についてのお問い合わせはこちらから。送信された内容は、回答のためAzure Communication Services Emailを通じてサイト管理者へ届けられます。
        </p>
        <ContactForm />
        <p className="contact-privacy-note">
          個人情報の取り扱いについては、<a href="/privacy">プライバシーポリシー</a>をご確認ください。
        </p>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Kohei Yamaguchi</span>
        <span className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="https://github.com/K0he1" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/kohei-yamaguchi-06429827a/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </span>
      </footer>
    </main>
  );
}

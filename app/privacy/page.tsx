import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | K's Home Page",
  description: "K's Home Pageにおける個人情報の取り扱いについて説明します。",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/">Kohei Yamaguchi</Link>
        <Link className="legal-back" href="/">トップページへ戻る</Link>
      </header>

      <article className="legal-content">
        <p className="eyebrow">PRIVACY POLICY</p>
        <h1>プライバシーポリシー</h1>
        <p className="legal-lead">
          K&apos;s Home Page（以下「本サイト」）では、お問い合わせフォームを通じて取得する情報を、以下のとおり取り扱います。
        </p>

        <section className="legal-section">
          <h2>1. 取得する情報</h2>
          <p>お問い合わせの際に、次の情報を入力いただく場合があります。</p>
          <ul>
            <li>お名前</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. 利用目的</h2>
          <p>取得した情報は、次の目的に限って利用します。</p>
          <ul>
            <li>お問い合わせへの回答および連絡</li>
            <li>本サイトおよび制作物の改善</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. 外部サービスの利用</h2>
          <p>
            お問い合わせ内容の送信には、Azure Static Web Apps上のAPIとAzure Communication Services Emailを利用します。入力内容は、問い合わせへの回答に必要な範囲で、サイト管理者のメールボックスへ送信されます。
          </p>
          <p>
            本サイトでは、広告配信やアクセス解析を目的とした第三者サービスは現在利用していません。
          </p>
        </section>

        <section className="legal-section">
          <h2>4. 保存と第三者提供</h2>
          <p>
            お問い合わせ内容を本サイトのデータベースに保存することはありません。ただし、送信されたメールは、メールサービスの仕様によりサイト管理者のメールボックスに保存される場合があります。
          </p>
          <p>
            法令に基づく場合を除き、取得した情報を第三者へ提供または販売することはありません。
          </p>
        </section>

        <section className="legal-section">
          <h2>5. 安全管理</h2>
          <p>
            取得した情報の漏えい、滅失または毀損を防ぐため、適切な安全管理措置を講じます。ただし、インターネット上の通信やサービスの性質上、完全な安全性を保証するものではありません。
          </p>
        </section>

        <section className="legal-section">
          <h2>6. 開示・訂正・削除等</h2>
          <p>
            ご本人から、当該情報の開示、訂正、削除等を希望される場合は、お問い合わせフォームからご連絡ください。本人確認のうえ、合理的な範囲で対応します。
          </p>
        </section>

        <section className="legal-section">
          <h2>7. ポリシーの変更</h2>
          <p>
            本ポリシーは、法令の変更や本サイトの機能変更に応じて改定することがあります。重要な変更がある場合は、本ページに掲載します。
          </p>
        </section>

        <p className="legal-date">制定日：2026年8月14日</p>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | K's Home Page",
  description: "K's Home Pageの利用規約です。",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/">Kohei Yamaguchi</Link>
        <Link className="legal-back" href="/">トップページへ戻る</Link>
      </header>

      <article className="legal-content">
        <p className="eyebrow">TERMS OF USE</p>
        <h1>利用規約</h1>
        <p className="legal-lead">
          本規約は、K&apos;s Home Page（以下「本サイト」）の利用条件を定めるものです。本サイトを利用した時点で、本規約に同意したものとみなします。
        </p>

        <section className="legal-section">
          <h2>1. 本サイトの内容</h2>
          <p>
            本サイトでは、運営者のプロフィール、制作物および関連情報を紹介しています。掲載内容は予告なく変更または終了することがあります。
          </p>
        </section>

        <section className="legal-section">
          <h2>2. 禁止事項</h2>
          <p>利用者は、次の行為を行ってはなりません。</p>
          <ul>
            <li>本サイトまたは関連サービスの運営を妨害する行為</li>
            <li>不正アクセス、過度な負荷を与える行為</li>
            <li>法令または公序良俗に反する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. 知的財産権</h2>
          <p>
            本サイトに掲載されている文章、画像、デザインその他のコンテンツに関する権利は、運営者または正当な権利者に帰属します。法令で認められる範囲を超えた無断利用を禁止します。
          </p>
        </section>

        <section className="legal-section">
          <h2>4. 免責事項</h2>
          <p>
            本サイトの情報は、正確性や完全性を保証するものではありません。本サイトの利用または掲載情報をもとにした判断によって生じた損害について、運営者は責任を負いません。
          </p>
          <p>
            外部サイトへのリンク先の内容やサービスについて、運営者は責任を負いません。
          </p>
        </section>

        <section className="legal-section">
          <h2>5. 規約の変更</h2>
          <p>
            本規約は、必要に応じて変更することがあります。変更後の規約は、本ページに掲載した時点から効力を生じます。
          </p>
        </section>

        <p className="legal-date">制定日：2026年8月14日</p>
      </article>
    </main>
  );
}

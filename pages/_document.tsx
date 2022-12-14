import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            defer
            async
          ></script>
        </Head>
        <body className="bg-darkBlue">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

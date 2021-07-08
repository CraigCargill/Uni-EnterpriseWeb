//Relevant imports
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template";
import userRoutes from "./routes/user.routes";
import dashRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import devBundle from "./devBundle";

// modules for server side rendering
import React from "react";
import ReactDOMServer from "react-dom/server";
import MainRouter from "./../client/MainRouter";
import { StaticRouter } from "react-router-dom";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import theme from "./../client/theme";

const app = express();
const CURRENT_WORKING_DIR = process.cwd();
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));
devBundle.compile(app);

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// secure apps by setting various HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "https://www.gstatic.com/",
        "https://api.themoviedb.org/",
      ],
      "connect-src": [
        "'self'",
        "'unsafe-inline'",
        "https://api.themoviedb.org/",
      ],
      "img-src": ["'self'", "'unsafe-inline'", "https://image.tmdb.org/"],
    },
  })
);
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.use("/", userRoutes);
app.use("/", dashRoutes);
app.use("/", authRoutes);
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});
app.get("*", (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheets.toString();
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  );
});
export default app;

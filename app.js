try {
    /** ********global variables************* */
    // eslint-disable-next-line no-undef
    ROOT_DIR = `${__dirname}/`;
    // eslint-disable-next-line no-undef
    IMAGE_FOLDER = 'public/media/';
    // eslint-disable-next-line no-undef
    ENVIRONMENT = 'local';
    /** ************************************* */
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    const morgan = require('morgan');
    const multer = require('multer');
    const vhost = require('vhost');
    const http = require('http');
  
    const app = express();
    const config = require('config');
    const domain = require('./config/domain_route')();
    const util = require('./util');
    // const Constants = require('./Constants');
    const db = require('./config/connection.js');
    // const { sequelize } = db;
  
  
    // force: true will drop the table if it already exists
    db.sequelize.sync({ force: false }).then(() => {
      // eslint-disable-next-line no-console
      console.log('Drop and Resync with { force: false }');
    });
  
  
    app.use(multer({ dest: './uploads/' }).array('imageFile', 1));
  
    // eslint-disable-next-line no-restricted-syntax
    for (const key of domain.domains) {
      app.use(vhost(key.domain_name, key.object));
    }
  
    // async function getAuthData() {
    //   sequelize.query("select roleId, path from AccessControl a JOIN routing r ON r.id = a.functionId")
    //     .then(function (users) {
    //       // We don't need spread here, since only the results will be returned for select queries
    //       AC = users
    //     })
    // }
  
  
    mapdetails = util.getMapdetails();
    appFunctions = util.getFunctionality();
    roleDetails = util.getAuthData();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    /** ************************************** */
  
    /** ************************************** */
    // mongooseObj = require(ROOT_DIR + 'config/connection').mongo_init();
  
    // catch 404 and forward to error handler
  
  
    app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
  
    // error handlers
  
    // development error handler
    // will print stacktrace
    if (config.env === 'local' || config.env === 'development') {
      app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
          message: err.message,
          error: err,
        });
      });
    }
  
    // production error handler
    // no stacktraces leaked to user
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json('error', {
        message: err.message,
        error: {},
      });
    });
  
    http.createServer(app).listen(config.server.port, () => {
      console.log(`Express server listening on port ${config.server.port} environment: ${config.env}`);
    });
  
    module.exports = app;
  } catch (err) {
    console.log(err);
  }
  
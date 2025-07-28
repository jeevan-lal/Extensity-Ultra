// @ts-nocheck

/**
  Hide JavaScript Dialog Message Box
*/
try {

  function main() {

    // ALERT FUNCTIONS
    var efAD = {

      // Store Message Key
      localKey: "CTH-DC-DIALOG-ALERT-MESSAGE",

      /**
       * Not Show This Javascript Alert Messages
       * [
       *   "Sorry, right click is not allowed..."
       * ]
       */
      notShowAlertMessage: function (msg: string) {
        if (msg == 'Sorry, right click is not allowed...') return false;
      },

      /**
       * Check Message Type
       * @param {String} msg 
       */
      checkMessageType(msg: string) {
        if (!msg) return "y"

        /**
         * Success Messages
         * ---------------------------------------
         * Record successfully submitted
         */
        var successMessageList = [/record successfully/, /record save successfully/, /saved/];
        var isMatchS = successMessageList.some(rx => rx.test(msg.trim().toLocaleLowerCase()));
        if (isMatchS) {
          return "s";
        }

        /**
         * Error Messages
         * ---------------------------------------
         * Error
         */
        var errorMessageList = [/error/];
        var isMatchD = errorMessageList.some(rx => rx.test(msg.trim().toLocaleLowerCase()));
        if (isMatchD) {
          return "d";
        }

        // By Default Warning Message Style
        return "y";
      },

      /**
       * INIT
       */
      init: function () {
        if (window.alert) {
          window.alert = function alert(msg) {

            // Set Alert Message to Local Storage
            localStorage.setItem(efAD.localKey, msg);

            // Set Javascript Alert Message Type ['d', 's', 'y']
            var alert_style = efAD.checkMessageType(msg);

            // include css in page
            if (typeof window.CustomAlertStyle === 'undefined') {
              window.CustomAlertStyle = function (css: string) {
                var head = document.head || document.getElementsByTagName('head')[0];
                if (head) {
                  var style = document.createElement('style');
                  // style.type = 'text/css';
                  style.appendChild(document.createTextNode(css));
                  head.appendChild(style);
                }
              };
            }

            window.CustomAlertStyle(
              '#custom_alert {\
                  font: 14px/16px sans-serif !important;\
                  position: fixed !important;\
                  top: 0 !important;\
                  right: 0 !important;\
                  margin: 0 !important;\
                  padding: 0 !important;\
                  list-style-type: none !important;\
                  float: left !important;\
                  cursor: pointer !important;\
                  text-align: left !important;\
                  z-index: 9999 !important;\
                }\
                #custom_alert ALERTBOX {\
                  border-width: 0 1px 4px 1px;\
                  float: right !important;\
                  border-radius: 0px;\
                  overflow: hidden;\
                  clear: both !important;\
                  overflow: hidden !important;\
                  font-size: 17px !important;\
                  white-space: pre-wrap !important;\
                  outline: 0 !important;\
                  -webkit-box-shadow: 0px 2px 8px rgba(0,0,0,0.2);\
                  -moz-box-shadow: 0px 2px 8px rgba(0,0,0,0.3);\
                  box-shadow: 0px 2px 8px rgba(0,0,0,0.3);\
                }\
                .danger {\
                  background-color: #ff4136 !important;\
                  color: rgb(255, 255, 255) !important;\
                }\
                .success {\
                  background-color: #05bd13 !important;\
                  color: rgb(255, 255, 255) !important;\
                }\
                .warning {\
                  background-color: #ffba00!important;\
                  color: #fff !important;\
                }\
              '
            );

            var alert_controller = document.getElementById('custom_alert') || document.createElement('DIALOG-GROUP');
            alert_controller.id = 'custom_alert';
            document.documentElement.appendChild(alert_controller);

            // alert click remove function
            alert_controller.addEventListener(
              'click',
              function (e: any) {
                var t = e.target;
                if (t.tagName == 'ALERTBOX') {
                  var h = t.clientHeight - 18;
                  t.style.height = h + 'px';
                  var i = 9;
                  var closing = setInterval(function () {
                    i--;
                    t.style.opacity = i / 10;
                    t.style.paddingTop = parseInt(t.style.paddingTop) - 1 + 'px';
                    t.style.paddingBottom = parseInt(t.style.paddingBottom) - 1 + 'px';
                    var currentHeight = parseInt(t.style.height) - h / 10;
                    t.style.height = (currentHeight < 0 ? 0 : currentHeight) + 'px';
                    if (i < 1) {
                      t.style.display = 'none';
                      clearInterval(closing);
                    }
                  }, 30);
                }
              },
              false
            );

            var cache = document.createElement('ALERTBOX');
            cache.style.margin = '5px 10px 8px';
            cache.style.padding = '12px 15px';
            cache.style.opacity = '12';
            cache.style.lineHeight = '1.4em';
            cache.tabIndex = 0;

            // show alert in the page
            (window.alert = function alert(msg: string) {
              // console.log(type);

              // Not Show [declare] Alert
              if (efAD.notShowAlertMessage(msg) === false) {
                return false;
              }

              // Set Alert Message to Local Storage
              localStorage.setItem(efAD.localKey, msg);

              // Set Javascript Alert Message Type ['d', 's', 'y']
              var alert_style = efAD.checkMessageType(msg);

              var box = cache.cloneNode(false);
              box.appendChild(document.createTextNode(msg));
              alert_controller.appendChild(box);
              var i = 1;
              var showing = setInterval(function () {
                box.style.opacity = 1;
                i++;
                box.style.paddingTop = parseInt(box.style.paddingTop) + 1 + 'px';
                box.style.paddingBottom = parseInt(box.style.paddingBottom) + 1 + 'px';
                if (alert_style == 's') {
                  box.className = 'success';
                } else if (alert_style == 'y') {
                  box.className = 'warning';
                } else {
                  box.className = 'danger';
                }
                if (i > 9) {
                  clearInterval(showing);
                }
              }, 30);
            })(msg);
          };
        }
      },
    };

    // Confirm FUNCTIONS
    var efCF = {

      // Store Message Key
      localKey: "CTH-DC-DIALOG-CONFIRM-MESSAGE",

      /**
       * Check Message Type
       * @param {String} msg 
       */
      checkMessageType(msg: string) {
        if (!msg) return "y"

        /**
         * Success Messages
         * ---------------------------------------
         * Record successfully submitted
         */
        var successMessageList = [/record successfully/, /record save successfully/, /saved/];
        var isMatchS = successMessageList.some(rx => rx.test(msg.trim().toLocaleLowerCase()));
        if (isMatchS) {
          return "s";
        }

        /**
         * Error Messages
         * ---------------------------------------
         * Error
         */
        var errorMessageList = [/error/];
        var isMatchD = errorMessageList.some(rx => rx.test(msg.trim().toLocaleLowerCase()));
        if (isMatchD) {
          return "d";
        }

        // By Default Warning Message Style
        return "y";
      },

      /**
       * INIT
       */
      init: function () {
        if (window.confirm) {
          window.confirm = function confirm(msg: string) {

            // Set Confirm Message to Local Storage
            localStorage.setItem(efCF.localKey, msg);

            // Set Javascript Confirm Message Type ['d', 's', 'y']
            var confirm_style = efCF.checkMessageType(msg);

            // include css in page
            if (typeof customConfirmStyle === 'undefined') {
              window.customConfirmStyle = function (css) {
                var head = document.head || document.getElementsByTagName('head')[0];
                if (head) {
                  var style = document.createElement('style');
                  // style.type = 'text/css';
                  style.appendChild(document.createTextNode(css));
                  head.appendChild(style);
                }
              };
            }

            customConfirmStyle(
              '#custom_confirm {\
                    font: 14px/16px sans-serif !important;\
                    position: fixed !important;\
                    top: 0 !important;\
                    right: 0 !important;\
                    margin: 0 !important;\
                    padding: 0 !important;\
                    list-style-type: none !important;\
                    float: left !important;\
                    cursor: pointer !important;\
                    text-align: left !important;\
                    z-index: 9999 !important;\
                }\
                #custom_confirm CONFIRMBOX {\
                    border-width: 0 1px 4px 1px;\
                    float: right !important;\
                    border-radius: 0px;\
                    overflow: hidden;\
                    clear: both !important;\
                    overflow: hidden !important;\
                    font-size: 17px !important;\
                    white-space: pre-wrap !important;\
                    outline: 0 !important;\
                    -webkit-box-shadow: 0px 2px 8px rgba(0,0,0,0.2);\
                    -moz-box-shadow: 0px 2px 8px rgba(0,0,0,0.3);\
                    box-shadow: 0px 2px 8px rgba(0,0,0,0.3);\
                }\
                .danger {\
                    background-color: #ff4136 !important;\
                    color: rgb(255, 255, 255) !important;\
                }\
                .success {\
                    background-color: #05bd13 !important;\
                    color: rgb(255, 255, 255) !important;\
                }\
                .warning {\
                    background-color: #ffba00!important;\
                    color: #fff !important;\
                }\
              '
            );

            var confirm_controller = document.getElementById('custom_confirm') || document.createElement('DIALOG-GROUP');
            confirm_controller.id = 'custom_confirm';
            document.documentElement.appendChild(confirm_controller);

            // confirm click remove function
            confirm_controller.addEventListener(
              'click',
              function (e) {
                var t = e.target;
                if (t.tagName == 'CONFIRMBOX') {
                  var h = t.clientHeight - 18;
                  t.style.height = h + 'px';
                  var i = 9;
                  var closing = setInterval(function () {
                    i--;
                    t.style.opacity = i / 10;
                    t.style.paddingTop = parseInt(t.style.paddingTop) - 1 + 'px';
                    t.style.paddingBottom = parseInt(t.style.paddingBottom) - 1 + 'px';
                    var currentHeight = parseInt(t.style.height) - h / 10;
                    t.style.height = (currentHeight < 0 ? 0 : currentHeight) + 'px';
                    if (i < 1) {
                      t.style.display = 'none';
                      clearInterval(closing);
                    }
                  }, 30);
                }
              },
              false
            );

            var cache = document.createElement('CONFIRMBOX');
            cache.style.margin = '5px 10px 8px';
            cache.style.padding = '12px 15px';
            cache.style.opacity = 12;
            cache.style.lineHeight = '1.4em';
            cache.tabIndex = 0;

            // show confirm in the page
            (window.confirm = function confirm(msg) {

              // Set Confirm Message to Local Storage
              localStorage.setItem(efCF.localKey, msg);

              // Set Javascript Confirm Message Type ['d', 's', 'y']
              var confirm_style = efCF.checkMessageType(msg);

              var box = cache.cloneNode(false);
              box.appendChild(document.createTextNode(msg));
              confirm_controller.appendChild(box);
              var i = 1;
              var showing = setInterval(function () {
                box.style.opacity = 1;
                i++;
                box.style.paddingTop = parseInt(box.style.paddingTop) + 1 + 'px';
                box.style.paddingBottom = parseInt(box.style.paddingBottom) + 1 + 'px';
                if (confirm_style == 's') {
                  box.className = 'success';
                } else if (confirm_style == 'y') {
                  box.className = 'warning';
                } else {
                  box.className = 'danger';
                }
                if (i > 9) {
                  clearInterval(showing);
                }
              }, 30);

              // Confirm Dialog Ok Message Text
              return true

            })(msg);

            // Confirm Dialog Ok Message Text
            return true
          };
        }
      },
    };

    // Get LocalStorage Data
    var on = localStorage.getItem("CTH-JSDC-STATUS");
    if (!on) return false;

    // DIALOG
    efAD.init()
    efCF.init()
  }

  if (!window.started) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + main + ')();'));
    // document.documentElement.appendChild(script);
    document.documentElement.insertBefore(script, document.documentElement.firstChild || null);
  }

} catch (error) {
}
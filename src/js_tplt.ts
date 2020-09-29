import {warning,onceWarning} from './util'
import {Tplt} from './Tplt'

export class DemoTplt extends Tplt{
  modulename:string;
  body:string="";
  finalize(){
    return `
import ${this.modulename} from './index.js'
${this.body}
    `
  }
}
export class IndexTplt extends Tplt {
  methods:Array<object>=null
  moduelID:string
  finalize(){
    return `${warning()}

import xengine from "@zkty-team/x-engine-moudle-engine";
import mock from "./mock";
function osCheck() {
  if (!xengine.hybrid) {
    return mock;
} 
  else {

    return  xengine.use("${this.moduelID}", 
    ${this.methods ? JSON.stringify(this.methods, null, "  ") : ""}
)}}

export default osCheck();
`
  }
}
export class MockTplt extends Tplt {
  methods:Array<object>=null
  moduelID:string
  methodGen(m){
    return `
    
    ${m.name}(args=${this.methods ? JSON.stringify(m.default_args, null, "          ") : null},userPromise){
      if(userPromise){
        return userPromise()
      }else{
        return new Promise((resolve, reject)=>{
          alert("${m.name} no h5 implementation, you can implement this function in mock.js in  h5/src/mock.js");
          resolve(null);
        });
      }

    }
    `
  }
  finalize(){
    return `
${onceWarning()}
export default {
${this.methods.map(m=>{return this.methodGen(m) })}
}
`
  }
}
export class HTMLTplt extends Tplt {
  buttons:Array<string> = []
  finalize(){
  return `
  <!DOCTYPE HTML>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="HandheldFriendly" content="true" />
    <meta name="MobileOptimized" content="320" />
    <title>Module_xxxx</title>
    <script type="text/javascript">

    </script>

    <style>
      * {
          -webkit-touch-callout: none;
          /*系统默认菜单被禁用*/
          -webkit-user-select: none;
          /*webkit浏览器*/
          -khtml-user-select: none;
          /*早期浏览器*/
          -moz-user-select: none;
          /*火狐*/
          -ms-user-select: none;
          /*IE10*/
          user-select: none;
      }

      input {
          -webkit-user-select: auto;
          /*webkit浏览器*/
      }

      textarea {
          -webkit-user-select: auto;
          /*webkit浏览器*/
      }

      #debug_text{
          margin: 0 auto;
          width: 90%;
          height: 144px;
          border: 1px solid #f7f7f7;
          background-color: #f7f7f7;
          margin-bottom: 10px;
          display: block;
          font-size: 20px;
      }

      .button-class {
          margin: 0 auto;
          width: 90%;
          height: 44px;
          border: 1px solid #f7f7f7;
          background-color: #f7f7f7;
          text-align: center;
          line-height: 44px;
          margin-bottom: 10px;
          display: block;
          border-radius: 50px;
          font-size: 20px;
      }
    </style>

</head>

<body>
    <!-- 示例 -->
    ${this.buttons.join("")}
    <textarea id="debug_text"></textarea>
</body>

</html>`

  }
}

// 命名空间
const moduleID = "com.zkty.module.ui";

interface XETipDTO{
  tipContent:string;
}

interface XEToastDTO{
  tipContent:string;
  duration:int;
  //success; loading;
  icon:string;
}

interface XEModalDTO{
  tipTitle?:string;
  tipContent:string;
  showCancel:boolean;
}

interface XEPickerDTO{
  // tapIndex:string;
  leftText:string;
  leftTextSize:int;
  leftTextColor:string;

  rightText:string;
  rightTextSize:int;
  rightTextColor:string;

  backgroundColor:string;
  backgroundColorAlpha:string;

  pickerBackgroundColor:string;
  pickerHeight:string;

  rowHeight:string;

  data:Array<Array<string>>;

  toolBarBackgroundColor:string;

  __event__:string;
}

interface XEAlertResultDTO{
  tapIndex:string;
}

interface XESheetDTO {
  // 标题
  title: string;
  // 子标题?
  itemList?: Array<string>;
  // 内容
  content?: string;
  // 点击子标题回调函数
  __event__: (index:string)=>void,
}

interface XERetDTO {
  content: string;
}

function showSuccessToast(arg:XEToastDTO={
  tipContent:"hello",
  duration:3000,
  icon:"success"
}){
  window.showSuccessToast = () => {
    ui
      .showSuccessToast()
      .then((res) => {
      });
  };
}

function showFailToast(arg:XEToastDTO={
  tipContent:"fail",
  duration:3000,
  icon:"fail"
}) {
  window.showFailToast = () => {
    ui
      .showFailToast()
      .then((res) => {
      });
  };
}

function showToast(arg:XEToastDTO={
  tipContent:"hello",
  duration:3000,
  icon:"success"
}) {
  window.showToast = () => {
    ui
      .showToast()
      .then((res) => {
      });
  };
}

function hideToast() {
  window.hideToast = () => {
    ui
      .hideToast()
      .then((res) => {
      });
  };
}

function hiddenHudToast() {
  window.hiddenHudToast = () => {
    ui
      .hiddenHudToast()
      .then((res) => {
      });
  };
}

function showLoading(arg:XETipDTO={tipContent:'加载提示'}) {
  window.showLoading = () => {
    ui
      .showLoading()
      .then((res) => {
      });
  };
}

function hideLoading() {
  window.hideLoading = () => {
    ui
      .hideLoading()
      .then((res) => {
      });
  };
}

function showModal(arg:XEModalDTO={tipTitle:'弹窗标题', tipContent:'弹窗内容', showCancel:true}) : XEAlertResultDTO{
  window.showModal = () => {
    ui
      .showModal()
      .then((res) => {
        document.getElementById("debug_text").innerText = JSON.stringify(res);
      });
  };
}

function showActionSheet(
  XESheetDTO: XESheetDTO = {
    title: "hello",
    itemList: ["hello", "world", "he"],
    content: "content",
    __event__: null,
  }
):XERetDTO{
  window.showActionSheet = (...args) => {
    ui
      .showActionSheet({
        title: "hello",
        itemList: ["hello", "world", "he"],
        content: "content",
        __event__: (res) => {
          document.getElementById("debug_text").innerText = res;
        },
      })
      .then((res) => {
        document.getElementById("debug_text").innerText = JSON.stringify(res);
      });
  };
}

function showPickerView(
  XEPickerDTO: XEPickerDTO = {
    rowHeight:'44',
    pickerHeight: '250',
    leftText:"取消",
    leftTextColor: "#3A6BEC",
    leftTextSize: 20,
    rightText:"确定",
    rightTextSize: 20,
    rightTextColor: "#3A6BEC",
    backgroundColor: "#1E1F20",
    backgroundColorAlpha: '0.7',
    pickerBackgroundColor: "#f7f7f7",
    toolBarBackgroundColor:"#f5f5f5",
    data: [
            ["北京A", "北京B", "北京C","北京D", "北京E", "北京F"],
            ["1街A", "1街B", "1街C","1街D", "1街E", "1街F"],
            ["2街A", "2街B", "2街C","2街D", "2街E", "2街F"],
            ["3街A", "3街B", "3街C","3街D", "3街E", "3街F"],
          ],
      __event__:null,
  }
):XERetDTO{
  window.showPickerView = (...args) => {
    ui
      .showPickerView({
        __event__: (res) => {
          document.getElementById("debug_text").innerText = res;
        },
      })
      .then((res) => {

        document.getElementById("debug_text").innerText = JSON.stringify(res);
      });
  };
}


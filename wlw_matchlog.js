// URL判定関数
function chk_url(urlstr){
  var matchlog_sub = /^https:\/\/wonderland-wars.net\/matchlog_sub.html$/;

  var ret = "error";

  if(matchlog_sub.test(urlstr)){
  	ret = "matchlog_sub";
  }
  else {
  	ret = "error";
  }

  return ret;
}

// ページ取得・解析関数
function get_page(request_info_array, func){
  // ページ取得結果格納用配列
  var results = [];
  $(request_info_array).each(function(i){
    results.push($.ajax(this));
  });

  return results;
}

// 対戦履歴ページ処理用関数
function analyze_matchlog_sub(str){
  var domObject = $.parseHTML(str);
  var ret = []
  $(domObject).find(".block_match_log").each(function(i){
    ret.push({
      result : $(this).find(".match_icon>img").attr("src"),
      cast : $(this).find(".match_my_team>.match_member>img:eq(0)").attr("src")
    })
  })
  return ret;
}

function exec(btn,url,page_cnt){
  // 複数回実行できないようボタンを非表示に
  btn.style.visibility = "hidden";

  var date = url.slice(-10)

  var request_info_array = [];
  for (var i = 0; i < page_cnt; i++) {
    request_info_array.push({
      type:   "GET",
      url:    url,
      data:  {
        type: "all",
        page: i
      }
    })
  }

  var gp = get_page(request_info_array);

  $.when.apply($,gp).done(function(response){
    var data_array = [];
    $(gp).each(function(i){
      $.merge(data_array,analyze_matchlog_sub(this.responseText));
    })

    var result_array = {};
    $(data_array).each(function(){
      // 結果配列に対象キャストの情報がなければ初期化
      if(!(this.cast in result_array)){
        result_array[this.cast] = {
          win:0,
          lose:0
        }
      }
      // 勝敗の結果を加算
      if(this.result.match(/win/)){
        result_array[this.cast].win++;
      }
      else{
        result_array[this.cast].lose++;
      }
    })

    var str = "<table align='center' border='0'>";
    for(key in result_array){

      var win = result_array[key].win;
      var lose = result_array[key].lose;

      // プレイ数と勝率を計算
      var cnt = win + lose;
      var wp = ((win/cnt)*100).toFixed(1);

      str += "<tr>";
      str += "<td width='64px' align='center'><img width=\"64px\" src=" + key + "></td>"
      str += "<td align='right'><b>" + cnt + "</b>戦</td>";
      str += "<td align='right'><b><font color='#a50000'>" + win + "</b></font>勝</td>"
      str += "<td align='right'><b><font color='#007ae1'>" + lose + "</b></font>敗</td>"
      str += "<td align='right'>(勝率:</td><td align='right'>" + wp + "%)</td>"
      str += "</tr>";
    }
    str += "</table>";
    $('#'+date+'').append(str);
  }).fail(function(){
    alert("取得失敗したページあります。");
  });
}

// メイン処理
// 実行したページのURLのチェックを行い、実行する処理モードを決定
var exec_mode = chk_url(location.href);
console.log($("#bml".length));

if(!($("#bml").size())){
  $("head").append("<meta id=\"bml\" />");
  // 詳細ページリクエスト用データを格納するための配列
  var request_info_array = [];

  $(".block_matchlog_list").each(function(i){
    // 全国対戦を行っているかチェック

    var match_block = ($(this).find(".block_matchlog_match"))

    if(!match_block[0]){
      return true;
    }

    var url = $(match_block).children("a").attr("href");
    var date = url.slice(-10)
    var play_cnt = $(match_block).find(".matchlog_list_total").html();
    var page_cnt = Math.ceil(play_cnt/10)
    var str = "<div id="+date+"><a onclick='javascript:exec(this,\"" + url + "\"," + page_cnt + ");'>キャスト別対戦成績を表示する</a></div>"
    $(this).find(".block_matchlog_match").after(str);
  });
}
else{
  alert("複数回実行しないでください");
}

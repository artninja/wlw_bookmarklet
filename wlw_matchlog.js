// エラーメッセージ表示関数
function disp_err(err_code){
  var error_mesg = [
    "不明なエラー",             // Error No:0
    "複数回実行しないでください",   // Error No:1
    "URLチェックに失敗しました。対戦履歴ページで実行していますか?"
  ];

  console.log("Error No:" + err_code);

  // エラーコード未設定、またはエラーメッセージのサイズ以上のエラーコードを渡された場合に「不明なエラー」(エラーコード0)にする。
  if(err_code == undefined || error_mesg.length < err_code){
    n = 0;
  }

  alert(error_mesg[err_code]);
}

// ページ取得
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

//
function exec(target,url,page_cnt){
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
      str += "<td width='48px' align='center'><img width=\"48px\" src=" + key + "></td>"
      str += "<td align='right'><b>" + cnt + "</b>戦</td>";
      str += "<td align='right'><b><font color='#a50000'>" + win + "</b></font>勝</td>"
      str += "<td align='right'><b><font color='#007ae1'>" + lose + "</b></font>敗</td>"
      str += "<td align='right'>(勝率:</td><td align='right'>" + wp + "%)</td>"
      str += "</tr>";
    }
    str += "</table>";
    $(target).append(str);
  }).fail(function(){
    alert("取得失敗したページあります。");
  });
}

// メイン処理
(function main(){
  var match_str = /^https:\/\/wonderland-wars.net\/matchlog_sub.html$/;
  if(match_str.test(location.href)){
  //URLチェックを行い、該当ページであれば以下の処理を実行する。

    $(".block_matchlog_list").each(function(i){
      // 全国対戦を行っているかチェック
      var match_block = ($(this).find(".block_matchlog_match"));
      if(!match_block[0]){
        // 行っていなかった場合、次のループへ(continue)
        return true;
      }

      // 戦績詳細ページの URL を取得
      var url = $(match_block).children("a").attr("href");

      // ToDo:ここに URLの取得に失敗したときの処理を追加

      // URL の末尾が日付になっているので、それを取得
      var date = url.slice(-10)

      // 全国対戦の対戦回数を取得
      var play_cnt = $(match_block).find(".matchlog_list_total").html();

      // 戦績詳細ページのページ数を算出(2017.2現在、10戦で1ページ増える計算)
      var page_cnt = Math.ceil(play_cnt/10)

      // 全国対戦の勝利数を取得
      var win_cnt = $(match_block).find(".matchlog_list_win").html();

      var str = "<div>";
      str += "<div>全体勝率:" + ((win_cnt/play_cnt)*100).toFixed(1)+"%</div>";
      str += "<input type=button value='キャスト別対戦成績を表示' />"
      str += "</div>";

      $(str).insertAfter($(this).find(".block_matchlog_match")).on('click','input',function(){
        // 複数回実行防止のため実行ボタンを非表示にする
        $(this).hide();
        // 無効にするだけならこっち
        //$(this).prop("disabled", true);

        target = $(this).parent();
        exec(target, url, page_cnt);
      });
    });
  }
  else{
    alert("URLチェックに失敗しました。対戦履歴ページで実行していますか?");
  }
})();

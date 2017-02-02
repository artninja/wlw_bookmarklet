# wlw_bookmarklet

とりあえず以下をブックマークのURの部分に書いて登録すれば使えます。
```
javascript:(function(d,i,s){if(document.getElementById(i)==null){s=d.createElement("script");s.src="https://rawgit.com/u5am1n/wlw_bookmarklet/develop/wlw_matchlog.js";s.id=i;d.body.appendChild(s);}else{alert("複数回実行しないでください");}})(document,"wlw_bml");
```

    javascript:(function(d,id,s){
      if(document.getElementById(id)==null){
        s=d.createElement("script");
        s.src="https://rawgit.com/u5am1n/wlw_bookmarklet/develop/wlw_matchlog.js";
        s.id=id;
        d.body.appendChild(s);
      }
      else{
        alert("複数回実行しないでください");
      }
    })(document,"wlw_bookmarklet");

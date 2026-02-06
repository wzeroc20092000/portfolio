
var dir_url= "https://sho-aka.benesse.ne.jp/sho-test/5/others/onimomo/"
var dir_url = "./";
var dir_url_game= "https://sho-aka.benesse.ne.jp/sho-test/5/others/onimomo/"
var dir_url_game = "../";
var _url = new URL(window.location.href);
var _hostname = _url.hostname;
var isBenesse = false;
var isBenesseAlert = '非KVS環境です。KVSが使用可能な環境下でKVSAPIの確認を行ってください';
var json_flg;
var topBack_flg=0;
var game_endFlg =0;

$(document).ready(function() {
  // ユーザーエージェントを取得
  var userAgent = navigator.userAgent.toLowerCase();

  // PCかモバイルかを判別
  if (userAgent.indexOf('windows') !== -1 || userAgent.indexOf('macintosh') !== -1) {
    $('body').addClass('pc');
  } else {
    $('body').addClass('mobile');
  }
});
/*====================
* SOUND
* SOUND.se.play('btn');
*====================*/
var SOUND = SOUND || {};
var SOUND_ending = SOUND_ending || {};

SOUND.nowbgm = '';

$(function () {
  SOUND.bgm = new Howl({
    src: [dir_url+'sounds/bgm.mp3'],
    loop:true,
    volume : 1
  })

  // SOUND.bgm.once('load', function () {
    SOUND.bgm.play();
    // checkKVS();
  // });

  SOUND.se = new Howl({
    src: [dir_url+'sounds/se.mp3'],
    volume : 1
  })

  SOUND.ok = new Howl({
    src: [dir_url+'sounds/ok.mp3'],
    volume : 1
  })

  SOUND.star = new Howl({
    src: [dir_url+'sounds/star.mp3'],
    volume : 1
  })

  SOUND.ng = new Howl({
    src: [dir_url+'sounds/ng.mp3'],
    volume : 1
  })

  SOUND.clear = new Howl({
    src: [dir_url+'sounds/clear.mp3'],
    volume : 1
  })

}());

function music_stop(){
  SOUND.clear.stop();
  SOUND.ok.stop();
  SOUND.star.stop();
  SOUND.ng.stop();
  voice_play_flg = false;
}

var APP = {}; // グローバル変数格納用
APP.dayCount = 0;
APP.pageName = '';
APP.pageSpeed = 600;

// ブラウザのbfcache無効用
window.onbeforeunload = function() {}; // IE用
window.onunload = function() {}; // IE以外用

/* UA
--------------------------------------------------*/
var userAgent = window.navigator.userAgent.toLowerCase();
var _ua = (function(u){
  return {
    Tablet:(u.indexOf("windows") !== -1 && u.indexOf("touch") !== -1 && u.indexOf("tabvar pc") == -1)
      || u.indexOf("ipad") !== -1
      || (u.indexOf("android") !== -1 && u.indexOf("mobile") == -1)
      || (u.indexOf("firefox") !== -1 && u.indexOf("tablet") !== -1)
      || u.indexOf("kindle") !== -1
      || u.indexOf("silk") !== -1
      || u.indexOf("playbook") !== -1,
    Mobile:(u.indexOf("windows") !== -1 && u.indexOf("phone") !== -1)
      || u.indexOf("iphone") !== -1
      || u.indexOf("ipod") !== -1
      || (u.indexOf("android") !== -1 && u.indexOf("mobile") !== -1)
      || (u.indexOf("firefox") !== -1 && u.indexOf("mobile") !== -1)
      || u.indexOf("blackberry") !== -1,
    iOS: u.indexOf("iphone") > 0
      || u.indexOf("ipod") > 0
  }
})(userAgent);

if (_ua.Tablet) {
  $('body').addClass('tablet');
} else if (_ua.Mobile) {
  $('body').addClass('mobile');
  APP.isSP = true;
} else {
  $('body').addClass('is-pc');
}
if (_ua.iOS) {
  $('body').addClass('ios');
}
if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
  $('body').addClass('ie');
} else if(userAgent.indexOf('edge') !== -1) {
  $('body').addClass('edge');
}
if (userAgent.indexOf('40s404') !== -1 || userAgent.indexOf('40S404') !== -1) {
  $('body').addClass('ct1');
  APP.CT1 = true;
}else if(userAgent.indexOf('tab-a03-bs') !== -1 || userAgent.indexOf('TAB-A03-BS') !== -1 ||
  userAgent.indexOf('tab-a03-br') !== -1 || userAgent.indexOf('TAB-A03-BR') !== -1) {
  $('body').addClass('ct2');
}
var isCT = /40S404|TAB-A03-BR|TAB-A05-BA/i.test(userAgent);
var isPreChu = isCT && /BenesseBrowser/i.test(userAgent);
var isCTZ = /TAB-A05-BA|BenesseShoBrowser/i.test(userAgent);
if (isCT || isCTZ) {
  APP.CT = true;
  $('body').addClass('ct');
}

var isSP = /iphone|ipod|ipad|android/i.test(userAgent);
var eventStart = isSP ? 'touchstart' : 'mousedown';
var eventEnd = isSP ? 'touchend' : 'mouseup';
var eventMove = isSP ? 'touchmove' : 'mousemove';

$(document).ready(function() {
  if (_hostname.indexOf('sgaku') !== -1) {
    isBenesse = true;
  } else if (_hostname.indexOf('sho-aka') !== -1) {
    isBenesse = true;
  } else {
    isBenesse = false;
  }

  if(isBenesse){
    // alert("API ベネッセサーバーである")
    if (APP.CT) {
      // alert("API CT端末")
      // ■[Dﾁｬ]学習状況取得API
      var resultStr = dcha_app.getLearningSituation();
      // JSON形式の文字列をパースする
      var result = JSON.parse(resultStr);
      // 処理結果
      var resultCode = result['ResultCode'];
      // エラーコード
      var errorCode = result['ErrorCode'];
      if (errorCode) {

        modalERROR('D002', '読みこみに失敗(しっぱい)しました。');
        return false;
      }
      // 取得結果
      var learningSituation = result['LearningSituation'];
      // 取得結果のJSON形式の文字列をパースする
      var resultDetail = JSON.parse(learningSituation);
      // 当日学習回数



      var urlParams = new URLSearchParams(window.location.search);
      // 特定のパラメータ 'paramName' を取得
      var paramValue = urlParams.get('comp_cnt');
      
      // 値が取得できたかをチェック
      if (paramValue) {
        // alert("API CT端末 デバッグ")
        APP.comp_cnt = parseInt(urlParams.get('comp_cnt'), 10);
      } else{
        // alert("API CT端末 正常")
        APP.comp_cnt = resultDetail['CompletedLessonCount']; // 物理名：resTodayStudyTimes
      }

      $(".nokori .nokori_cnt").html(APP.comp_cnt)

      first_check();
    } else {
      // alert("API CT端末ではない")
      modalERROR('D001', '読みこみに失敗(しっぱい)しました<br>チャレンジパッドで見にきてね。');

      APP.comp_cnt=30;
      $(".nokori .nokori_cnt").html(APP.comp_cnt)
 
      first_check();
    }
  } else {
    APP.comp_cnt=30;
    $(".nokori .nokori_cnt").html(APP.comp_cnt)
    first_check();
  }
});

////////////////////////////////////////
/* KVS関連追加 */
var appid = 'sp605';
var dataName = 'onimomo24g';
var kvsJSON = {
  'app_id': appid,
  'key_values': []
}
var KVS = {
  unRegist: false,
  post: function (_afterFunc) {

    var sendJson = JSON.parse(JSON.stringify(kvsJSON));
    var dataSet = {
      "data_name": dataName,
      "key_value": SAVEDATA
    }
    sendJson.key_values[0] = dataSet;
    kvslib.post(sendJson, function(status, body, response) {
      try {
        if ("00" == status) {

          var getData = (isObject(body)) ? body : JSON.parse(body);
          KVS.unRegist = false;
          SAVEDATA = getData.key_values[0].key_value;
          afterKVS(_afterFunc);
        } else {
          body.errors.forEach(function(elm) {
            if (null !== elm.error_code) {

              modalERROR('K001', '読みこみに失敗（しっぱい）しました。ホーム画面（がめん）にもどってください。');
            }
          });
        }
      } catch (e) {}
    });
  },
  get: function (_afterFunc) {

    var sendJson = JSON.parse(JSON.stringify(kvsJSON));
    var dataSet = {
      "data_name": dataName
    }
    sendJson.key_values[0] = dataSet;
    kvslib.get(sendJson, function(status, body, response) {
      try {
        if ("00" == status) {

          var getData = (isObject(body)) ? body : JSON.parse(body);
          SAVEDATA = getData.key_values[0].key_value;
          afterKVS(_afterFunc);
        } else {
          body.errors.forEach(function(elm) {
            if (null !== elm.error_code) {
              if (elm.error_code == 'WE07-0111-R024' || elm.error_code == 'WE07-0112-R024') { // KVS未登録

                KVS.post(_afterFunc); // ■KVS
              } else {

                modalERROR('K002', '読みこみに失敗（しっぱい）しました。ホーム画面（がめん）にもどってください。');
              }
            }
          });
        }
      } catch (e) {}
    });
  },
  put: function (_afterFunc) {

    var sendJson = JSON.parse(JSON.stringify(kvsJSON));
    var dataSet = {
      "data_name": dataName,
      "key_value": SAVEDATA
    }
    sendJson.key_values[0] = dataSet;
    kvslib.put(sendJson, function(status, body, response) {
      try {
        if ("00" == status) {

          var getData = (isObject(body)) ? body : JSON.parse(body);
          SAVEDATA = getData.key_values[0].key_value;
          afterKVS(_afterFunc);
        } else {
          body.errors.forEach(function(elm) {
            if (null !== elm.error_code) {

              modalERROR('K003', '読みこみに失敗（しっぱい）しました。ホーム画面（がめん）にもどってください。');
            }
          });
        }
      } catch (e) {}
    });
  },
  delete: function () {

    var sendJson = JSON.parse(JSON.stringify(kvsJSON));
    var dataSet = {
      "data_name": dataName
    }
    sendJson.key_values[0] = dataSet;
    kvslib.del(sendJson, function(status, body, response) {
      try {
        if ("00" == status) {

          window.location.reload();
        } else {
          body.errors.forEach(function (elm) {
            if (null !== elm.error_code) {

              modalERROR('K004', '読みこみに失敗（しっぱい）しました。ホーム画面（がめん）にもどってください。');
            }
          });
        }
      } catch (e) {}
    });
  }
}
function afterKVS(_afterFunc) {



  if (typeof _afterFunc == 'function') {
    _afterFunc();
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function modalERROR(_code, _message) {
  var codetext = $('#error .error-num').text();
  if (codetext == '') {
    $('#error .error-num').text(_code);
  } else {
    $('#error .error-num').text(codetext + ',' + _code);
  }
  var message = '<p>' + _message + '</p>';
  $('#error .error-message').append(message);
  $('#error').show();
}
/* KVS関連追加ここまで */
////////////////////////////////////////
var SAVEDATA = {
    "clear_cnt":0,
    "challenge_cnt":0,
    "first_flg":0,
    "ending_flg":0
}

var answer_txt = "";
var siren_sel_no;
// animationendイベントをブラウザ互換性を考慮して設定
var animationEndEvents = 'animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd';
var star_loop_cnt;
var siren_sel_no_old = "";
var topStarView_flg=0;
var nokori_cnt;
var story_txt_cnt=1;
// インターバルIDを保存する変数
let intervalId;
var ending_txt_cnt = 1;
var voice_play_flg = false;
var voice_play_flg2 = false;

// 現在のクリア状況を取得先を決める
function first_check(){
    // $(".count_0").hide();
    $("#page-top .is_play").removeClass("count_0");
    if (isBenesse) {
        KVS.get(startPage_check); // ■KVS
    } else {
        // alert('【注意：ここをおそうKVSput時】'+isBenesseAlert);
        // 現在のクリア状況を取得
        startPage_check()
    }
}

// 最初に表示する画面を設定
function startPage_check(){
    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    if(SAVEDATA.first_flg == 0){
        $(".common-back-button").hide();
        $("#page-top").hide();
        toggleImages(1);
        $("#page-start").fadeIn("slow",function(){
            star_check();
        });
        // $("#page-ending").fadeIn("slow");
    } else if(SAVEDATA.ending_flg == 0 && SAVEDATA.clear_cnt == 30){
        // エンディング途中に離脱した場合はエンディングから開始する
        $(".common-back-button").hide();
        $("#page-ending").fadeIn("slow",function(){
            star_check();
        });
    } else {
        $("#page-start").hide();
        $(".common-back-button").fadeIn();
        $("#page-top").fadeIn("slow",function(){
            star_check();
        });
    }
}

// 現在のクリア状況を取得
function star_check(){

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    // topの試練結果のacrを一旦全部削除
    $('[id^=page-top] .star_').removeClass('is_act');

    // topの試練結果にクリア済みの数だけ星をつける
    if(topStarView_flg == 0){
        
        if(SAVEDATA.clear_cnt == 0 && nokori_cnt == 0){
            // SAVEDATA.clear_cntが0なら最初からチャレンジしようを出す
            // $(".count_0").fadeIn("slow");
            $("#page-top .is_play").addClass("count_0");
        } else {
            // 最初の場合は星を順番につける
            $('#page-top [class^="star_"]').slice(0, parseInt(SAVEDATA.clear_cnt)).each(function(index, element) {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass('is_act');
                    // 全ての処理が終わったかどうかをチェック
                    if (index === parseInt(SAVEDATA.clear_cnt) - 1) {
                        if(nokori_cnt == 0){
                            if(SAVEDATA.clear_cnt != 30){
                                var enableButtonTimer = setTimeout(function() {
                                    // $(".count_0").fadeIn("slow");
                                    $("#page-top .is_play").addClass("count_0");
                                    // タイマーをクリア
                                    clearTimeout(enableButtonTimer);
                                }, 500);
                            }
                        } else {
                            // $(".count_0").hide();
                            $("#page-top .is_play").removeClass("count_0");
                        }
                    }
                }, index * 100); // 0.1秒ごとに実行
            });
        }        
        topStarView_flg = 1;
    } else {

        if(SAVEDATA.clear_cnt == 0 && nokori_cnt == 0){
            // SAVEDATA.clear_cntが0なら最初からチャレンジしようを出す
            // $(".count_0").fadeIn("slow");
            $("#page-top .is_play").addClass("count_0");
        } else {
            // 二回目以降は星を一気につける
            for (var i = 1; i <= SAVEDATA.clear_cnt; i++) {
                $('#page-top .star_' + i).addClass('is_act');
                // 最後の要素の場合に発火させたい処理を追加
                if (i == SAVEDATA.clear_cnt) {
                    if(nokori_cnt == 0){
                        if(SAVEDATA.clear_cnt != 30){
                            var enableButtonTimer = setTimeout(function() {
                                // $(".count_0").fadeIn("slow");
                                $("#page-top .is_play").addClass("count_0");
                                // タイマーをクリア
                                clearTimeout(enableButtonTimer);
                            }, 500);
                        }
                    } else {
                        // $(".count_0").hide();
                        $("#page-top .is_play").removeClass("count_0");
                    }
                }
            }
        }
    }

    // 現在プレイ可能な試練をアクティブにする
    switch (true) {
        case (SAVEDATA.clear_cnt >= 6 && SAVEDATA.clear_cnt < 12):
            play_check(2)
            break;
        case (SAVEDATA.clear_cnt >= 12 && SAVEDATA.clear_cnt < 18):
            play_check(3)
            break;
        case (SAVEDATA.clear_cnt >= 18 && SAVEDATA.clear_cnt < 24):
            play_check(4)
            break;
        case (SAVEDATA.clear_cnt >= 24 && SAVEDATA.clear_cnt <= 30):
            play_check(5)
            break;
        default:
            break;
    }
}

// 現在プレイ可能な試練をアクティブにする
function play_check(cnt){
    // cntより前の .challenge 要素に対して src の変更と is_play クラスの追加
    for (var i = 1; i <= cnt; i++) {
        $("#page-top .challenge" + i + " img").attr('src', dir_url + 'img/btn/challenge' + i + '_a.png');
        $("#page-top .challenge" + i).addClass("is_play");
        $("#page-top .challenge" + (i-1)).removeClass("is_play");
        $("#page-top .challenge" + (i-1)).addClass("is_clear");
    }

    if(SAVEDATA.clear_cnt == 30){
        $("#page-top .challenge5").removeClass("is_play");
        $("#page-top .challenge5").addClass("is_clear");
        $(".btn_ending").show();
    }
}

// 最新の残りプレイ回数を表示
function nokori_cnt_check(){

    // APIより取得した南海チャレンジできるかの回数を格納
    let compCnt = parseInt(APP.comp_cnt, 10) || 0;
    // プレイした回数を格納
    let challengeCnt = parseInt(SAVEDATA.challenge_cnt, 10) || 0;

    //チャレンジ可能回数-現在のチャレンジ回数で残りプレイ回数を計算
    nokori_cnt = compCnt - challengeCnt;

    // 残りプレイ回数を残り回数の所に入れる
    $(".nokori .nokori_cnt").html(nokori_cnt)

    hiden_check();
}

// 秘伝の所の表示内容を設定
function hiden_check(){
    $(".bth_hiden_1").removeClass("is_hiden_act");
    $(".bth_hiden_2").removeClass("is_hiden_act");

    // 秘伝のデータをJSONファイルから作成
    $.getJSON(dir_url + 'json/qa.json', function(data) {
        // siren_1のデータを取得
        var siren1Data = data.siren;
        for (var i = 1; i <= 30; i++) {
            $(".kokoro_"+i).html("<p>★"+siren1Data[(i - 1)].hiden+"</p>");
        }
    });

    switch (true) {
        case (SAVEDATA.clear_cnt > 0 && SAVEDATA.clear_cnt <= 18):
            $(".bth_hiden_1").addClass("is_hiden_act");
            $(".bth_hiden_1 img").attr('src', dir_url + 'img/btn/bth_hiden_1_a.png');
            break;
        case (SAVEDATA.clear_cnt > 18 && SAVEDATA.clear_cnt <= 30):
            $(".bth_hiden_1").addClass("is_hiden_act");
            $(".bth_hiden_2").addClass("is_hiden_act");
            $(".bth_hiden_1 img").attr('src', dir_url + 'img/btn/bth_hiden_1_a.png');
            $(".bth_hiden_2 img").attr('src', dir_url + 'img/btn/bth_hiden_2_a.png');
            break;
        default:
            console.log("clear_cntの値が範囲外です");
    }

    // // イベントのバインドを解除
    $(document).off('click', '.bth_hiden_1.is_hiden_act');
    $(document).off('click', '.bth_hiden_2.is_hiden_act');

    // アニメーションが始まる前にスクロールバーを隠す
    $('#page-hiden1 .page-center .main_wrap .main').css('overflow-y', 'hidden');

    // 秘伝の巻1を押下イベントをバインド
    $(document).on("click",".bth_hiden_1.is_hiden_act",function(){
        // ボタン連打対策
        btn_on_chenge($(this))

        // 全ての kokoro_ クラスを非表示にする
        $("[class^='kokoro_']").hide();
        $("[class^='hiden_']").hide();
        $("[class^='hiden_'] img").hide();
        // clear_cnt の数値分だけ表示させる
        for (var i = 1; i <= SAVEDATA.clear_cnt; i++) {
            $(".kokoro_" + i).show();
        }

        $(".common-back-button").fadeOut("slow");
        $("#page-top").fadeOut("slow",function(){
            $(".wrapper-ct-vertical-fixed").addClass("is_hiden");
            $("#page-hiden1").fadeIn("slow");
            // 任意の要素をクリックしたときに背景位置を変更する
            $('#page-hiden1 .main_wrap').css('background-position', '-55px 0');
             
            // アニメーション終了後に発火させる
            $('#page-hiden1 .main_wrap').on('transitionend webkitTransitionEnd oTransitionEnd', function() {
                // ここにアニメーション終了後に実行したい処理を記述
                // clear_cnt の数値に応じたケース文
                switch(true) {
                    case (SAVEDATA.clear_cnt > 0 && SAVEDATA.clear_cnt <= 6):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 6 && SAVEDATA.clear_cnt <= 12):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 12 && SAVEDATA.clear_cnt <= 18):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 18 && SAVEDATA.clear_cnt <= 24):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        $(".hiden_4, .hiden_4 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 24 && SAVEDATA.clear_cnt <= 30):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        $(".hiden_4, .hiden_4 img").fadeIn("slow");
                        $(".hiden_5, .hiden_5 img").fadeIn("slow");
                        break;
                    default:
                        break;
                }
                // アニメーションが終了した後にスクロールバーを表示する
                $('#page-hiden1 .page-center .main_wrap .main').css('overflow-y', 'auto');
            });
        })
    });

    // 秘伝の巻2を押下イベントをバインド
    $(document).one("click",".bth_hiden_2.is_hiden_act",function(){
        // ボタン連打対策
        btn_on_chenge($(this))

        // 全ての kokoro_ クラスを非表示にする
        $("[class^='kokoro_']").hide();
        $("[class^='hiden_']").hide();
        $("[class^='hiden_'] img").hide();

        for (var i = 1; i <= SAVEDATA.clear_cnt; i++) {
            $(".kokoro_" + i).show();
        }

        $(".common-back-button").fadeOut("slow");
        $("#page-top").fadeOut("slow",function(){
            $(".wrapper-ct-vertical-fixed").addClass("is_hiden");
            $("#page-hiden2").fadeIn("slow");
            // 任意の要素をクリックしたときに背景位置を変更する
            $('#page-hiden2 .main_wrap').css('background-position', '-55px 0');

            // アニメーション終了後に発火させる
            $('#page-hiden2 .main_wrap').on('transitionend webkitTransitionEnd oTransitionEnd', function() {
                // ここにアニメーション終了後に実行したい処理を記述
                // clear_cnt の数値に応じたケース文
                switch(true) {
                    case (SAVEDATA.clear_cnt > 0 && SAVEDATA.clear_cnt <= 6):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 6 && SAVEDATA.clear_cnt <= 12):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 12 && SAVEDATA.clear_cnt <= 18):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 18 && SAVEDATA.clear_cnt <= 24):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        $(".hiden_4, .hiden_4 img").fadeIn("slow");
                        break;
                    case (SAVEDATA.clear_cnt > 24 && SAVEDATA.clear_cnt <= 30):
                        $(".hiden_1, .hiden_1 img").fadeIn("slow");
                        $(".hiden_2, .hiden_2 img").fadeIn("slow");
                        $(".hiden_3, .hiden_3 img").fadeIn("slow");
                        $(".hiden_4, .hiden_4 img").fadeIn("slow");
                        $(".hiden_5, .hiden_5 img").fadeIn("slow");
                        break;
                    default:
                        break;
                }
            });
        })
    });
}

// ストーリーボタン押下時
$(".btn_story").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))
    story_txt_cnt= 1

    // style属性を削除
    $('#page-start [class^=ptn]').removeAttr('style');
    // showクラスを削除
    $('#page-start [class^=ptn]').removeClass('show');
    // 1にshowクラスを追加
    // $("#page-start .ptn1_wrap").addClass("show");

    // $("#page-start .ptn1_wrap").show();
    $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
    $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_1.png');
    $(".common-back-button").fadeOut("slow");

    toggleImages(1);
    $('#page-top').fadeOut("slow", function(){
        $("#page-start").fadeIn("slow");
    })
});

// つかいかたボタン押下時
$(".btn_howto").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))
    $(".common-back-button").fadeOut("slow");
    $(".howto_next").hide();
    $("#page-howto .back").show();
    $('#page-top').fadeOut("slow", function(){
        $(".wrapper-ct-vertical-fixed").addClass("is_hiden");
        $("#page-howto").fadeIn("slow");
    })
});

// 口パク用
function toggleImages(no) {
    let isImage1Visible = true;
    // インターバルを設定し、IDを保存
    intervalId = setInterval(function() {
        if (isImage1Visible) {
            $('.ptn'+no+'_wrap .m_close').css('display', 'none');
            $('.ptn'+no+'_wrap .m_open').css('display', 'block');
        } else {
            $('.ptn'+no+'_wrap .m_close').css('display', 'block');
            $('.ptn'+no+'_wrap .m_open').css('display', 'none');
        }
        isImage1Visible = !isImage1Visible;
    }, 500); // 0.5秒ごとに切り替え
};

// インターバルを停止する関数
function stopInterval() {
    clearInterval(intervalId);
}

// ストーリー内の次へボタン押下時
$("#page-start .start_next").on("click",function(){
    music_stop();

    // ボタン連打対策
    btn_on_chenge($(this))
    story_txt_cnt+=1;
    $("#page-start .ptn4_wrap .page-footer .start_next").show();
    $("#page-start .ptn4_wrap .page-footer .start_end").hide();

    switch (story_txt_cnt) {
        case 1:

            toggleImages(1);
            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_1.png');
            // NAを再生

            break;
        case 2:

            toggleImages(1);
            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_2.png');
            $("#page-start .ptn2_wrap,#page-start .ptn3_wrap,#page-start .ptn4_wrap").show();
            // NAを再生
            break;
        case 3:

            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_3.png');
            // NAを再生

            break;
        case 4:

            stopInterval()
            toggleImages(2);

            var isAnimationRunning = false;
            $(".ptn1_wrap").animate({width: 'toggle'}, "slow", function() {
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                        // 話しているキャラの画像を変更
                    $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
                    // テキストを変更
                    $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_4.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });
            
            break;
        case 5:

            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_5.png');
            // NAを再生

            break;
        case 6:

            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_6.png');
            // NAを再生
            break;
        case 7:

            stopInterval()
            $("#page-start .ptn2_wrap .page-center .main_wrap .char_1").addClass("is_jump")

            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_7.png');
            // NAを再生
            break;
        case 8:

            $("#page-start .ptn2_wrap .page-center .main_wrap .char_1").removeClass("is_jump")
            toggleImages(3);

            var isAnimationRunning = false;
            $(".ptn2_wrap").animate({width: 'toggle'}, "slow",function(){
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    // 話しているキャラの画像を変更
                    $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
                    // テキストを変更
                    $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_8.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });

            break;
        case 9:


            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_9.png');
            // NAを再生

            break;
        case 10:

            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/main_char.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_10.png');
            // NAを再生
            break;
        case 11:

            stopInterval()
            toggleImages(4);

            var isAnimationRunning = false;
            $(".ptn3_wrap").animate({width: 'toggle'}, "slow",function(){
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    // 話しているキャラの画像を変更
                    $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
                    // テキストを変更
                    $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_11.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });

            break;
        case 12:

            
            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_12.png');
            // NAを再生

            break;
        case 13:

            // エフェクトを表示
            
            // 話しているキャラの画像を変更
            $("#page-start .char_icon_wrap img").attr('src', dir_url + 'img/start/txt/chourou.png');
            // テキストを変更
            $("#page-start .page-footer .txt_wrap img").attr('src', dir_url + 'img/start/txt/txt_13.png');
            $("#page-start .ptn4_wrap .page-footer .start_next").hide();
            $("#page-start .ptn4_wrap .page-footer .start_end").show();
            // NAを再生
        
        default:

    }
    
});

// ストーリー内の終わりボタン押下時
$("#page-start .start_end").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))

    $('#page-start').fadeOut("slow", function(){
        music_stop();
        if(SAVEDATA.first_flg == 1){
            $(".common-back-button").fadeIn();
            $("#page-top").fadeIn("slow");
        } else {
            $(".common-back-button").fadeOut();
            $("#page-howto .back").hide();
            $("#page-howto").fadeIn("slow");
        }
    })
});

// 初回ストーリーから使い方を見た時のみに出る次へボタン押下時
$(".howto_next").on("click",function(){
    // ボタン押下音
    if(!voice_play_flg){
        voice_play_flg = true;
        // ボタン押下音
        SOUND.se.play();
        SOUND.se.on('end', function() {
            voice_play_flg = false;
        });
    }
    if (isBenesse) {
        KVS.get(putFirstKvs); // ■KVS
    } else {
        alert('【注意：初回ストーリを見たフラグ】'+isBenesseAlert);
        putFirstKvs();
    }

    $("#page-howto").fadeOut("slow",function(){
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            star_check();
        });
    });
});

function putFirstKvs(){
    SAVEDATA.first_flg = 1;
    if (isBenesse) {
        // 初回ストーリー見たフラグを立てる
        KVS.put(); // ■KVS
    } else {
        // alert('【注意：ここをおそうKVSput時】'+isBenesseAlert);
    }
}

// エンディングボタン押下時
$(".btn_ending").on("click",function(){
// $(".btn_story").on("click",function(){
    
// ボタン連打対策
    btn_on_chenge($(this))
    ending_txt_cnt= 1

    toggleImages(1);
    // style属性を削除
    $('#page-ending [class^=ptn]').removeAttr('style');
    // showクラスを削除
    $('#page-ending [class^=ptn]').removeClass('show');
    // 1にshowクラスを追加
    $("#page-ending .ptn1_wrap").addClass("show");

    $("#page-ending .ptn1_wrap").show();
    $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char.png');
    $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_1.png');
    $(".common-back-button").fadeOut("slow");

    $('#page-top').fadeOut("slow", function(){
        // 0.5秒ごとに無限に画像を切り替える
        // setInterval(toggleImages, 500);
        $("#page-ending").fadeIn("slow");
        // NAを再生

    })
});

// エンディング内の次へボタン押下時
$("#page-ending .ending_next").on("click",function(){
    music_stop();

    // ボタン連打対策
    btn_on_chenge($(this))
    ending_txt_cnt+=1;
    $("#page-ending .ptn6_wrap .ending_next").show();
    $("#page-ending .ptn6_wrap .ending_end").hide();

    switch (ending_txt_cnt) {
        case 1:

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_1.png');
            // NAを再生

            break;
        case 2:

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_2.png');
            // NAを再生
            break;
        case 3:

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_3.png');
            // NAを再生

            break;
        case 4:

            stopInterval()
            toggleImages(2);

            var isAnimationRunning = false;
            $(".ptn1_wrap").animate({width: 'toggle'}, "slow",function(){
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    // 話しているキャラの画像を変更
                    $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/momotarou.png');
                    // テキストを変更
                    $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_4.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });

            break;
        case 5:

            stopInterval()
            toggleImages(3);
            $("#page-ending .ptn2_wrap").hide();
            $("#page-ending .ptn3_wrap").show();

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char.png');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_5.png');
            // NAを再生

            break;
        case 6:

            stopInterval()
            toggleImages(4);
            $("#page-ending .ptn3_wrap").hide();
            $("#page-ending .ptn4_wrap").show();
            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_6.png');
            // NAを再生

            break;
        case 7:

            // フラッシュを表示
            $("#page-ending .ptn4_wrap .flash").show();
            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_7.png');
            // NAを再生

            break;
        case 8:

            // フラッシュを非表示
            $("#page-ending .ptn4_wrap .flash").hide();
            stopInterval()
            toggleImages(5);

            var isAnimationRunning = false;
            $(".ptn4_wrap").animate({width: 'toggle'}, "slow",function(){
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    // 話しているキャラの画像を変更
                    $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char2.png');
                    // テキストを変更
                    $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_8.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });

            break;
        case 9:


            // エフェクトを表示
            $("#page-ending .ptn5_wrap .effect_2").show();
            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char2.png');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_9.png');
            // NAを再生

            break;
        case 10:
            stopInterval()

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', dir_url + '');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_10.png');
            // NAを再生

            break;
        case 11:

            stopInterval()
            toggleImages(6);

            var isAnimationRunning = false;
            $(".ptn5_wrap").animate({width: 'toggle'}, "slow",function(){
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    // 話しているキャラの画像を変更
                    $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char2.png');
                    // テキストを変更
                    $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_11.png');
                    // NAを再生
                }
            }).promise().done(function() {
                // アニメーションが完了した後にフラグをリセット
                isAnimationRunning = false;
            });

            break;
        case 12:

            // 話しているキャラの画像を変更
            $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char2.png');
            // テキストを変更
            $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_12.png');
            $("#page-ending .ptn6_wrap .ending_next").hide();
            $("#page-ending .ptn6_wrap .ending_end").show();
            // NAを再生

            break;
        default:

    }
});

// エンディング内の終わりボタン押下時
$("#page-ending .ending_end").on("click",function(){

    if (isBenesse) {
        KVS.get(putEndingKvs); // ■KVS
    } else {
        alert('【注意：初回ストーリを見たフラグ】'+isBenesseAlert);
        putEndingKvs();
    }

    $('#page-ending').fadeOut("slow", function(){
        music_stop();
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            star_check();
        });
    })
})

function putEndingKvs(){
    SAVEDATA.ending_flg = 1;
    if (isBenesse) {
        KVS.put(); // ■KVS
    } else {
        // alert('【注意：ここをおそうKVSput時】'+isBenesseAlert);
    }
}

// ご褒美ボタン押下
$(".gohoubi").on("click",function(){
    $(".common-back-button").fadeOut("slow");
    // ボタン連打対策
    btn_on_chenge($(this))
    $('#page-top').fadeOut("slow", function(){
        $(".common-back-button").fadeOut("slow");
        $("#page-kokuchi").fadeIn("slow");
    })
});

// トップへ戻る押下時
$(".back").on("click",function(){
    var sectionId = $(this).closest('section').attr('id');
    // ボタン連打対策
    btn_on_chenge($(this))
    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    $('#'+sectionId).fadeOut("slow", function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        $(".common-back-button").fadeIn();
        $("#page-top").fadeIn("slow",function(){
            // 現在のクリア状況を取得
            star_check();
        });
    })
});

// 秘伝の巻1のトップへ戻る押下時
$("#page-hiden1 .back").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    $("#page-hiden1").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            // 現在のクリア状況を取得
            // star_check();
            $('#page-hiden1 .main_wrap').css('background-position', '-1140px 0');
        });
    })
});

// 秘伝の巻2のトップへ戻る押下時
$("#page-hiden2 .back").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    $("#page-hiden2").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            // 現在のクリア状況を取得
            // star_check();
            $('#page-hiden2 .main_wrap').css('background-position', '-1140px 0');
        });
    })
});

// 試練のページをスライドさせて表示
function siren_slide(siren_sel_no){
    switch(siren_sel_no) {
        case 1:
            // siren_sel_noが1の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt;
            break;
        case 2:
            // siren_sel_noが2の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 6;
            break;
        case 3:
            // siren_sel_noが3の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 12;
            break;
        case 4:
            // siren_sel_noが4の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 18;
            break;
        case 5:
            // siren_sel_noが5の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 24;
            break;
        default:
            // siren_sel_noが1～5以外の場合の処理
            break;
    }

    $('#page-siren .page-center').addClass('is_slide');
    // .is_slideクラスを持つ要素に対してアニメーション終了イベントをバインド
    $(document).on(animationEndEvents, '#page-siren .page-center.is_slide', function() {
        // アニメーションが終了した後に実行する処理
        $("#page-siren .main .txt").fadeIn("slow");
        $("#page-siren .main .start_btn").fadeIn("slow");
        $("#page-siren .main .result").fadeIn("slow",function(){
            // 星をつける処理
            $('#page-siren [class^="star_"]').slice(0, star_loop_cnt).each(function(index) {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass('is_act');
                }, index * 100); // 0.1秒ごとに実行
            });
            $('#page-ok .result [class^="star_"]').slice(0, parseInt(star_loop_cnt)).each(function(index) {
                var $this = $(this);
                setTimeout(function() {
                    $this.addClass('is_act');
                }, index * 100); // 0.1秒ごとに実行
            });
        });
    });
}

function isButtonDisabled(button) {
    return window.getComputedStyle(button, '::before').content !== 'none';
}

// 試練ボタン押下時
$(document).on("click","[class^=challenge].is_play", function() {
    if (!isButtonDisabled(this)) {
        if(nokori_cnt == 0){
            return false;
        } else {
            $(".common-back-button").fadeOut("slow");
            // 最新の残りプレイ回数を表示
            nokori_cnt_check();
        
            // 現在のクリア状況を取得
            // star_check();
        
            // クリックされたボタンのインデックスを取得
            siren_sel_no = $(".main_l button").index(this) + 1;
    
            // 受けている試練の状態をチェック
            // 毎回★が初ゲット状態のアニメーションがついてしまう為の処理
            if(siren_sel_no_old ==""){
                // 最初ならその試練NOを格納
                siren_sel_no_old = siren_sel_no;
            } else {
                // 現在受けている試練NOと前に受けた試練NOが違っているかチェック
                // 試練が同じであれば、一度ゲットしている★の部分はアニメーションさせない
                if(siren_sel_no_old != siren_sel_no){
                    // 違っていたら、結果画面の★を全部削除
                    // これによって初ゲットのアニメができるようになる
                    $(".result [class^=star_]").removeClass("is_act");
                    siren_sel_no_old = siren_sel_no;
                }
            }
            // ボタン連打対策
            btn_on_chenge($(this))
            $('#page-siren .page-center').addClass('is_slide');
            $("#page-top").fadeOut("slow",function(){
                // 試練のキャラをチェックする
                char_check(siren_sel_no);
                $("#page-siren").fadeIn("slow",function(){
                    siren_slide(siren_sel_no);
                });
            })
        }
    }
});

// クリアした後の試練ボタン押下時
$(document).on("click","[class^=challenge].is_clear", function() {
    // ボタン連打対策
    btn_on_chenge($(this))

    // クリア後の遷移先ボタンをトップに戻す
    $("#page-clear .btn_clear,#page-clear .btn_clear2").hide();
    $("#page-clear .btn_clear3").show();
    
    $(".common-back-button").fadeOut("slow");
    // クリックされたボタンのインデックスを取得
    siren_sel_no = $(".main_l button").index(this) + 1;

    $("#page-ok").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        switch (true) {
            case (siren_sel_no == 1):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren1/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren1/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren1/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren1/clear_back.png');
                $("#page-clear .clear_chourou").hide();
                $("#page-top").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (siren_sel_no == 2):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren2/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren2/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren2/clear_main.png');
                $('#page-clear .clear_main').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/main_bg.png)');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren2/clear_back.png');
                $("#page-clear .clear_chourou").hide();

                $("#page-top").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (siren_sel_no == 3):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren3/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren3/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren3/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren3/clear_back.png');

                $("#page-clear .clear_chourou").show();
                $("#page-top").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (siren_sel_no == 4):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren4/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren4/clear_char.png');
                $("#page-clear .clear_char").css('top', '43%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren4/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src','');
                $("#page-clear .clear_chourou").hide();

                $("#page-top").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (siren_sel_no == 5):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren5/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren5/clear_char.png');
                $("#page-clear .clear_char").css('top', '43%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren5/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src','');
                $("#page-clear .clear_chourou").hide();

                $("#page-top").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });
                break;
            default:
                break;
        }
    })

});

// 試練のキャラをチェックする
function char_check(siren_sel_no){

    switch(siren_sel_no) {
        case 1:
            // siren_sel_noが1の場合の処理
            $('#page-siren .page-center .main_wrap .main .txt').css('right', '80px');
            break;
        case 2:
            // siren_sel_noが2の場合の処理
            $('#page-siren .page-center .main_wrap .main .txt').css('right', '180px');
            break;
        case 3:
            // siren_sel_noが3の場合の処理
            $('#page-siren .page-center .main_wrap .main .txt').css('right', '95px');
            break;
        case 4:
            // siren_sel_noが4の場合の処理
            $('#page-siren .page-center .main_wrap .main .txt').css('right', '110px');
            break;
        case 5:
            // siren_sel_noが5の場合の処理
            $('#page-siren .page-center .main_wrap .main .txt').css('right', '75px');
            break;
        default:
            // siren_sel_noが1～5以外の場合の処理
            break;
    }

    $("#page-siren .ttl img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/ttl.png');
    $("#page-siren .txt img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/txt.png');
    $('#page-siren .page-center').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/main_bg.png)');

    $("#page-siren2 .ttl img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/ttl.png');
    $("#page-siren2 .char img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/char.png');
    $('#page-siren2 .page-center').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/question.png)');
    $('#page-siren2 .main').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/main_bg2.png)');
    $('#page-siren2 .question').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/q_bg.png)');

    $("#page-ok .char img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/char.png');

    $("#page-ng .ttl img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/ttl.png');
    $("#page-ng .char img").attr('src', dir_url + 'img/siren/siren'+siren_sel_no+'/char.png');
    $("#page-ng .char").css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/main_bg2.png)');
}

// 試練に挑戦　ここをタッチボタン押下時
$(".start_btn").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    // イベントのバインドを解除
    $(document).off('click', '.is_ok');
    $(document).off('click', '.is_ng');

    // 問題を作成
    $("#page-siren").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        qa_create();
    })
});

// 問題を作成
function qa_create(){

    var q_no;
    // q_npの表示させる番号を設定する
    switch(siren_sel_no) {
        case 1:
            // siren_sel_noが1の場合の処理
            q_no = parseInt(SAVEDATA.clear_cnt, 10) + 1;
            break;
        case 2:
            // siren_sel_noが2の場合の処理
            q_no = parseInt(SAVEDATA.clear_cnt, 10) - 5;
            break;
        case 3:
            // siren_sel_noが3の場合の処理
            q_no = parseInt(SAVEDATA.clear_cnt, 10) - 11;
            break;
        case 4:
            // siren_sel_noが4の場合の処理
            q_no = parseInt(SAVEDATA.clear_cnt, 10) - 17;
            break;
        case 5:
            // siren_sel_noが5の場合の処理
            q_no = parseInt(SAVEDATA.clear_cnt, 10) - 23;
            break;
        default:
            // siren_sel_noが1～5以外の場合の処理
            break;
    }
    $("#page-siren2 .question_wrap .q_no img").attr('src', dir_url + 'img/siren/q_no/q'+q_no+'.png');

    // JSONファイルからデータを取得
    $.getJSON(dir_url + 'json/qa.json', function(data) {
        // siren_1のデータを取得
        var siren1Data = data.siren;
       
        // データを表示
        var secondQuestion = siren1Data[SAVEDATA.clear_cnt];
        
        // 質問を表示
        $(".question").html("<p>"+secondQuestion.question+"</p>");

        // ans_1とans_2の内容をランダムに配置
        var answers = [secondQuestion.ans_1, secondQuestion.ans_2];
        answers.sort(() => Math.random() - 0.5);

        answer_txt = secondQuestion.ans_3;

        $("#page-ok .ok_wrap .ok_txt").html(answer_txt);

        // 一度classを削除する
        $(".ans_1").removeClass("is_ok is_ng");
        $(".ans_2").removeClass("is_ok is_ng");
        
        // ボタンのテキストを設定し、クラスを追加
        if (answers[0] === secondQuestion.ans_1) {
            $(".ans_1").html("<p>"+answers[0]+"</p>").addClass("is_ok");
            $(".ans_2").html("<p>"+answers[1]+"</p>").addClass("is_ng");;
        } else {
            $(".ans_1").html("<p>"+answers[0]+"</p>").addClass("is_ng");;
            $(".ans_2").html("<p>"+answers[1]+"</p>").addClass("is_ok");
        }

        // 正解がクリックされたときのイベントハンドラー
        $(document).one('click', '.is_ok', function() {
            // ボタン押下音
            if(!voice_play_flg){
                voice_play_flg = true;
                // ボタン押下音
                SOUND.se.play();
                SOUND.se.on('end', function() {
                    voice_play_flg = false;
                });
            }

            $('#page-ok .wakatta_btn').prop("disabled", true);

            // ボタン連打対策
            $('.is_ok').prop("disabled", true);
            $('.is_ng').prop("disabled", true);
            // 最新のkvsデータをget
            if (isBenesse) {
                KVS.get(ok_putKvs); // ■KVS
            } else {
                // alert('【注意：ここをおそうKVSput時】'+isBenesseAlert);
                ok_putKvs();
            }
        });

        // 間違いがクリックされたときのイベントハンドラー（オプション）
        $(document).on('click', '.is_ng', function() {

            if(!voice_play_flg){
                voice_play_flg = true;
                // ボタン押下音
                SOUND.se.play();
                SOUND.se.on('end', function() {
                    voice_play_flg = false;
                });
            }

            // 回答ボタン連打対策
            $('#page-ng .wakatta_btn').prop("disabled", true);
            $('.is_ok').prop("disabled", true);
            $('.is_ng').prop("disabled", true);

            $("#page-siren2").fadeOut("slow",function(){
                $(".wrapper-ct-vertical-fixed").addClass("is_hiden");
                $("#page-ng").fadeIn("slow",function(){
                    if(!voice_play_flg){
                        voice_play_flg = true;
                        SOUND.ng.play();
                        SOUND.ng.on('end', function() {
                            // NGページのわかったボタンを活性化
                            $('#page-ng .wakatta_btn').prop("disabled", false);
                            voice_play_flg = false;
                        });
                    }
                });
            })
        });
    });
    $("#page-siren2").fadeIn("slow",function(){
        // 回答ボタンを押せるように
        $('.is_ok').prop("disabled", false);
        $('.is_ng').prop("disabled", false);
    });
}

function ok_putKvs(){

    // kvsのSAVEDATA.clear_cntをインクリメント
    SAVEDATA.clear_cnt = parseInt(SAVEDATA.clear_cnt) + 1;
    
    switch(siren_sel_no) {
        case 1:
            // siren_sel_noが1の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt;
            break;
        case 2:
            // siren_sel_noが2の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 6;
            break;
        case 3:
            // siren_sel_noが3の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 12;
            break;
        case 4:
            // siren_sel_noが4の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 18;
            break;
        case 5:
            // siren_sel_noが5の場合の処理
            star_loop_cnt = SAVEDATA.clear_cnt - 24;
            break;
        default:
            // siren_sel_noが1～5以外の場合の処理
            break;
    }

    // プレイした回数をインクリメント
    SAVEDATA.challenge_cnt+=1;

    // 数値を文字列に変換(KVS対策)
    // SAVEDATA.clearCntStr = SAVEDATA.clear_cnt.toString();
    // SAVEDATA.challengeCntStr = SAVEDATA.challenge_cnt.toString();
    
    // kvsのSAVEDATA.clear_cntをインクリメントした値とプレイした回数をKVSに保存

    if (isBenesse) {
        KVS.put(put_afterKVS); // ■KVS
    } else {
        // alert('【注意：ここをおそうKVSput時】'+isBenesseAlert);
        put_afterKVS();
    }
}


function put_afterKVS(){
    $("#page-siren2").fadeOut("slow",function(){
        if(siren_sel_no == 4 || siren_sel_no == 5){
            $(".ok_wrap").css('background-image', 'url('+dir_url +'img/siren/ok_bg2.png)');
        }

        // 最新のAPP.comp_cntを取得する（予定）
        nokori_cnt_check();

        $(".wrapper-ct-vertical-fixed").addClass("is_hiden");
        // 最新の残りプレイ回数を表示(回転させるclassをつける)
        $(".nokori_cnt").addClass("spin");

        $("#page-ok").fadeIn("slow",function(){
            if(!voice_play_flg){
                voice_play_flg = true;
                SOUND.ok.play();
                SOUND.ok.on('end', function() {
                    $(".nokori_cnt").removeClass("spin");
                    // 正解したら星を点灯
                    $('#page-ok .result [class^="star_"]').slice(0, parseInt(star_loop_cnt)).each(function(index) {
                        var $this = $(this);
                        setTimeout(function() {
                            $this.addClass('is_act');
                        }, index * 100); // 0.1秒ごとに実行
                    });
                    if(!voice_play_flg2){
                        voice_play_flg2 = true;
                        SOUND.star.play();
                        SOUND.star.on('end', function() {
                            // ボタン連打対策解除
                            // OKページのわかったボタンを活性化
                            $('#page-ok .wakatta_btn').prop("disabled", false);
                            voice_play_flg2 = false;
                        });
                    }
                });
                voice_play_flg = false;
            }
        });
    })
}

// 正解ページのわかったボタン押下時わかった
$("#page-ok .wakatta_btn").on("click",function(){

    // ボタン連打対策
    btn_on_chenge($(this))

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    // クリア後の遷移先ボタンを戻す
    $("#page-clear .btn_clear2,#page-clear .btn_clear3").hide();
    $("#page-clear .btn_clear").show();
    
    // 現在のクリア状況を取得
    // star_check();

    $("#page-ok").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        switch (true) {
            case (SAVEDATA.clear_cnt == 6):
                $("#page-top .challenge2 img").attr('src', dir_url + 'img/btn/challenge2_a.png');
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren1/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren1/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren1/clear_back.png');
                $("#page-clear .clear_chourou").hide();

                $("#page-ok").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (SAVEDATA.clear_cnt == 12):
                $("#page-top .challenge2 img").attr('src', dir_url + 'img/btn/challenge2_a.png');
                $("#page-top .challenge3 img").attr('src', dir_url + 'img/btn/challenge3_a.png');
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren2/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren2/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren2/clear_main.png');
                $('#page-clear .clear_main').css('background-image', 'url('+dir_url +'img/siren/siren'+siren_sel_no+'/main_bg.png)');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren2/clear_back.png');
                $("#page-clear .clear_chourou").hide();

                $("#page-ok").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (SAVEDATA.clear_cnt == 18):
                $("#page-top .challenge2 img").attr('src', dir_url + 'img/btn/challenge2_a.png');
                $("#page-top .challenge3 img").attr('src', dir_url + 'img/btn/challenge3_a.png');
                $("#page-top .challenge4 img").attr('src', dir_url + 'img/btn/challenge4_a.png');
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren3/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren3/clear_char.png');
                $("#page-clear .clear_char").css('top', '62%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren3/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src', dir_url + 'img/siren/siren3/clear_back.png');
                $("#page-clear .clear_chourou").show();

                $("#page-ok").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (SAVEDATA.clear_cnt == 24):
                $("#page-top .challenge2 img").attr('src', dir_url + 'img/btn/challenge2_a.png');
                $("#page-top .challenge3 img").attr('src', dir_url + 'img/btn/challenge3_a.png');
                $("#page-top .challenge4 img").attr('src', dir_url + 'img/btn/challenge4_a.png');
                $("#page-top .challenge5 img").attr('src', dir_url + 'img/btn/challenge5_a.png');
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren4/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren4/clear_char.png');
                $("#page-clear .clear_char").css('top', '43%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren4/clear_main.png');
                $("#page-clear .clear_back_wrap img").attr('src','');
                $("#page-clear .clear_chourou").hide();

                $("#page-ok").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            case (SAVEDATA.clear_cnt == 30):
                $("#page-clear .ttl img").attr('src', dir_url + 'img/siren/siren5/ttl_clear.png');
                $("#page-clear .clear_char").attr('src', dir_url + 'img/siren/siren5/clear_char.png');
                $("#page-clear .clear_char").css('top', '43%');
                $("#page-clear .clear_main").attr('src', dir_url + 'img/siren/siren5/clear_main.png');
                $("#page-top .challenge5").removeClass("is_play");
                $("#page-top .challenge5").addClass("is_clear");
                $("#page-clear .btn_clear").hide();
                $("#page-clear .btn_clear2").show();
                $("#page-clear .clear_back_wrap img").attr('src','');
                $("#page-clear .clear_chourou").hide();

                $("#page-ok").fadeOut("slow",function(){
                    $("#page-clear").fadeIn("slow",function(){
                        if(!voice_play_flg){
                            voice_play_flg = true;
                            // ボタン押下音
                            SOUND.clear.play();
                            SOUND.clear.on('end', function() {
                                voice_play_flg = false;
                            });
                        }
                    });
                });

                break;
            default:
                if(nokori_cnt == 0){
                    $("#page-clear").fadeOut("slow",function(){
                        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
                            $("#page-top .is_play").addClass("count_0");
                            $(".common-back-button").fadeIn("slow");
                            $("#page-top").fadeIn("slow",function(){
                                // 現在のクリア状況を取得
                                star_check();
                            });
                    })
                } else{
                    // 問題を作成
                    qa_create();
                }
                break;
        }
    })
});

// 不正解ページのわかったボタン押下時
$("#page-ng .wakatta_btn").on("click",function(){

    // ボタン連打対策
    btn_on_chenge($(this))

    // 最新の残りプレイ回数を表示
    nokori_cnt_check();

    $("#page-ng").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        $("#page-siren2").fadeIn("slow",function(){
            // 回答ボタンを押せるように
            $('.is_ok').prop("disabled", false);
            $('.is_ng').prop("disabled", false);
        });
    })
});

// クリア時のホームに戻って次のページへボタン押下時
$("#page-clear .btn_clear").on("click",function(){
    music_stop();

    // ボタン連打対策
    btn_on_chenge($(this))

    switch (true) {
        case (SAVEDATA.clear_cnt >= 6 && SAVEDATA.clear_cnt < 12):
            play_check(2)
            break;
        case (SAVEDATA.clear_cnt >= 12 && SAVEDATA.clear_cnt < 18):
            play_check(3)
            break;
        case (SAVEDATA.clear_cnt >= 18 && SAVEDATA.clear_cnt < 24):
            play_check(4)
            break;
        case (SAVEDATA.clear_cnt >= 24 && SAVEDATA.clear_cnt <= 30):
            play_check(5)
            break;
        default:
            break;
    }

    $("#page-clear").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        // 右上の戻るボタンを表示
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            // 現在のクリア状況を取得
            star_check();
        });
    })
});

// 桃太郎との勝負の行方はボタン押下時
$("#page-clear .btn_clear2").on("click",function(){
    // ボタン連打対策
    btn_on_chenge($(this))

    $(".btn_ending").show();

    $("#page-ok").fadeOut("slow",function(){
        ending_txt_cnt= 1

        toggleImages(1);
        // style属性を削除
        $('#page-ending [class^=ptn]').removeAttr('style');
        // showクラスを削除
        $('#page-ending [class^=ptn]').removeClass('show');
        // 1にshowクラスを追加
        $("#page-ending .ptn1_wrap").addClass("show");

        $("#page-ending .ptn1_wrap").show();
        $("#page-ending .char_icon_wrap img").attr('src', dir_url + 'img/ending/txt/main_char.png');
        $("#page-ending .page-footer .txt_wrap img").attr('src', dir_url + 'img/ending/txt/txt_1.png');

        $('#page-clear').fadeOut("slow", function(){
            if(SAVEDATA.ending_flg == 1){
                $("#page-top").fadeIn("slow");
            } else {
                $("#page-ending").fadeIn("slow",function(){
                });
            }
        })

    });
});

// クリア時のホームに戻って次のページへボタン押下時
$("#page-clear .btn_clear3").on("click",function(){
    music_stop();


    // ボタン連打対策
    btn_on_chenge($(this))
    $("#page-clear").fadeOut("slow",function(){
        $(".wrapper-ct-vertical-fixed").removeClass("is_hiden");
        // 右上の戻るボタンを表示
        $(".common-back-button").fadeIn("slow");
        $("#page-top").fadeIn("slow",function(){
            // 現在のクリア状況を取得
            star_check();
        });
    })
});


// ボタン連打対策
function btn_on_chenge(elm){
    // ボタン押下音
    if(!voice_play_flg){
        voice_play_flg = true;
        // ボタン押下音
        SOUND.se.play();
        SOUND.se.on('end', function() {
            voice_play_flg = false;
        });
    }

    // ボタン連打対策
    const $button = elm; // クリックされたボタンのみを対象にする
    $button.prop("disabled", true);
    $button.addClass("is_push");

    // タイマーIDを保持する変数
    var enableButtonTimer = setTimeout(function() {
        $button.prop("disabled", false);
        $button.removeClass("is_push");

        // タイマーをクリア
        clearTimeout(enableButtonTimer);
    }, 1000);
}
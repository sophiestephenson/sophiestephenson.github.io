(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  function queryString() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var i = 0, queryObj = {}, pair;
    var queryStr = window.location.search.substring(1);
    var queryArr = queryStr.split('&');
    for (i = 0; i < queryArr.length; i++) {
      pair = queryArr[i].split('=');
      // If first entry with this name
      if (typeof queryObj[pair[0]] === 'undefined') {
        queryObj[pair[0]] = pair[1];
        // If second entry with this name
      } else if (typeof queryObj[pair[0]] === 'string') {
        queryObj[pair[0]] = [queryObj[pair[0]], pair[1]];
        // If third or later entry with this name
      } else {
        queryObj[pair[0]].push(pair[1]);
      }
    }
    return queryObj;
  }

  var setUrlQuery = (function() {
    var baseUrl =  window.location.href.split('?')[0];
    return function(query) {
      if (typeof query === 'string') {
        window.history.replaceState(null, '', baseUrl + query);
      } else {
        window.history.replaceState(null, '', baseUrl);
      }
    };
  })();

  window.Lazyload.js(SOURCES.jquery, function() {
    var $tags = $('.js-tags');
    var $articleTags = $tags.find('button');
    var $tagShowAll = $tags.find('.tag-button--all');
    var $result = $('.js-result');
    var $articles = $result.find('.item');
    var $lastFocusButton = null;
    var hasInit = false;

    function searchButtonsByTag(_tag/*raw tag*/) {
      if (!_tag) {
        return $tagShowAll;
      }
      var _buttons = $articleTags.filter('[data-encode="' + _tag + '"]');
      if (_buttons.length === 0) {
        return $tagShowAll;
      }
      return _buttons;
	}
	
    function buttonFocus(target) {
      if (target) {
        target.addClass('focus');
        $lastFocusButton && !$lastFocusButton.is(target) && $lastFocusButton.removeClass('focus');
        $lastFocusButton = target;
      }
    }

    function tagSelect (tag/*raw tag*/, target) {
      var result = {};
      var j, k, _tag;

      for (j = 0; j < $articles.length; j++) {
        if (tag === '' || tag === undefined) {
          result[j] = true;
        } else {
          var tags = $articles.eq(j).data('tags').split(',');
          for (k = 0; k < tags.length; k++) {
            if (tags[k] === tag) {
			  result[j] = true; 
			  break;
            }
          }
        }
      }

      for (i = 0; i < $articles.length; i++) {
        result[i] && $articles.eq(i).removeClass('d-none');
        result[i] || $articles.eq(i).addClass('d-none');
      }

      hasInit || ($result.removeClass('d-none'), hasInit = true);


      if (target) {
        buttonFocus(target);
        _tag = target.attr('data-encode');
        if (_tag === '' || typeof _tag !== 'string') {
          setUrlQuery();
        } else {
          setUrlQuery('?tag=' + _tag);
        }
      } else {
        buttonFocus(searchButtonsByTag(tag));
      }
    }

    var query = queryString(), _tag = query.tag;
	init(); 
	tagSelect(_tag);
    $tags.on('click', 'button', function() {
      tagSelect($(this).data('encode'), $(this));
    });

  });
})();

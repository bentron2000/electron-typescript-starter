export const getEmoji = (option?: string | null) => {
  const allEmojisArray = [
    '🀄',
    '🃏',
    '🅰',
    '🅱',
    '🅾',
    '🅿',
    '🆎',
    '🆑',
    '🆒',
    '🆓',
    '🆔',
    '🆕',
    '🆖',
    '🆗',
    '🆘',
    '🆙',
    '🆚',
    '🇦🇨',
    '🇦🇩',
    '🇦🇪',
    '🇦🇫',
    '🇦🇬',
    '🇦🇮',
    '🇦🇱',
    '🇦🇲',
    '🇦🇴',
    '🇦🇶',
    '🇦🇷',
    '🇦🇸',
    '🇦🇹',
    '🇦🇺',
    '🇦🇼',
    '🇦🇽',
    '🇦🇿',
    '🇦',
    '🇧🇦',
    '🇧🇧',
    '🇧🇩',
    '🇧🇪',
    '🇧🇫',
    '🇧🇬',
    '🇧🇭',
    '🇧🇮',
    '🇧🇯',
    '🇧🇱',
    '🇧🇲',
    '🇧🇳',
    '🇧🇴',
    '🇧🇶',
    '🇧🇷',
    '🇧🇸',
    '🇧🇹',
    '🇧🇻',
    '🇧🇼',
    '🇧🇾',
    '🇧🇿',
    '🇧',
    '🇨🇦',
    '🇨🇨',
    '🇨🇩',
    '🇨🇫',
    '🇨🇬',
    '🇨🇭',
    '🇨🇮',
    '🇨🇰',
    '🇨🇱',
    '🇨🇲',
    '🇨🇳',
    '🇨🇴',
    '🇨🇵',
    '🇨🇷',
    '🇨🇺',
    '🇨🇻',
    '🇨🇼',
    '🇨🇽',
    '🇨🇾',
    '🇨🇿',
    '🇨',
    '🇩🇪',
    '🇩🇬',
    '🇩🇯',
    '🇩🇰',
    '🇩🇲',
    '🇩🇴',
    '🇩🇿',
    '🇩',
    '🇪🇦',
    '🇪🇨',
    '🇪🇪',
    '🇪🇬',
    '🇪🇭',
    '🇪🇷',
    '🇪🇸',
    '🇪🇹',
    '🇪🇺',
    '🇪',
    '🇫🇮',
    '🇫🇯',
    '🇫🇰',
    '🇫🇲',
    '🇫🇴',
    '🇫🇷',
    '🇫',
    '🇬🇦',
    '🇬🇧',
    '🇬🇩',
    '🇬🇪',
    '🇬🇫',
    '🇬🇬',
    '🇬🇭',
    '🇬🇮',
    '🇬🇱',
    '🇬🇲',
    '🇬🇳',
    '🇬🇵',
    '🇬🇶',
    '🇬🇷',
    '🇬🇸',
    '🇬🇹',
    '🇬🇺',
    '🇬🇼',
    '🇬🇾',
    '🇬',
    '🇭🇰',
    '🇭🇲',
    '🇭🇳',
    '🇭🇷',
    '🇭🇹',
    '🇭🇺',
    '🇭',
    '🇮🇨',
    '🇮🇩',
    '🇮🇪',
    '🇮🇱',
    '🇮🇲',
    '🇮🇳',
    '🇮🇴',
    '🇮🇶',
    '🇮🇷',
    '🇮🇸',
    '🇮🇹',
    '🇮',
    '🇯🇪',
    '🇯🇲',
    '🇯🇴',
    '🇯🇵',
    '🇯',
    '🇰🇪',
    '🇰🇬',
    '🇰🇭',
    '🇰🇮',
    '🇰🇲',
    '🇰🇳',
    '🇰🇵',
    '🇰🇷',
    '🇰🇼',
    '🇰🇾',
    '🇰🇿',
    '🇰',
    '🇱🇦',
    '🇱🇧',
    '🇱🇨',
    '🇱🇮',
    '🇱🇰',
    '🇱🇷',
    '🇱🇸',
    '🇱🇹',
    '🇱🇺',
    '🇱🇻',
    '🇱🇾',
    '🇱',
    '🇲🇦',
    '🇲🇨',
    '🇲🇩',
    '🇲🇪',
    '🇲🇫',
    '🇲🇬',
    '🇲🇭',
    '🇲🇰',
    '🇲🇱',
    '🇲🇲',
    '🇲🇳',
    '🇲🇴',
    '🇲🇵',
    '🇲🇶',
    '🇲🇷',
    '🇲🇸',
    '🇲🇹',
    '🇲🇺',
    '🇲🇻',
    '🇲🇼',
    '🇲🇽',
    '🇲🇾',
    '🇲🇿',
    '🇲',
    '🇳🇦',
    '🇳🇨',
    '🇳🇪',
    '🇳🇫',
    '🇳🇬',
    '🇳🇮',
    '🇳🇱',
    '🇳🇴',
    '🇳🇵',
    '🇳🇷',
    '🇳🇺',
    '🇳🇿',
    '🇳',
    '🇴🇲',
    '🇴',
    '🇵🇦',
    '🇵🇪',
    '🇵🇫',
    '🇵🇬',
    '🇵🇭',
    '🇵🇰',
    '🇵🇱',
    '🇵🇲',
    '🇵🇳',
    '🇵🇷',
    '🇵🇸',
    '🇵🇹',
    '🇵🇼',
    '🇵🇾',
    '🇵',
    '🇶🇦',
    '🇶',
    '🇷🇪',
    '🇷🇴',
    '🇷🇸',
    '🇷🇺',
    '🇷🇼',
    '🇷',
    '🇸🇦',
    '🇸🇧',
    '🇸🇨',
    '🇸🇩',
    '🇸🇪',
    '🇸🇬',
    '🇸🇭',
    '🇸🇮',
    '🇸🇯',
    '🇸🇰',
    '🇸🇱',
    '🇸🇲',
    '🇸🇳',
    '🇸🇴',
    '🇸🇷',
    '🇸🇸',
    '🇸🇹',
    '🇸🇻',
    '🇸🇽',
    '🇸🇾',
    '🇸🇿',
    '🇸',
    '🇹🇦',
    '🇹🇨',
    '🇹🇩',
    '🇹🇫',
    '🇹🇬',
    '🇹🇭',
    '🇹🇯',
    '🇹🇰',
    '🇹🇱',
    '🇹🇲',
    '🇹🇳',
    '🇹🇴',
    '🇹🇷',
    '🇹🇹',
    '🇹🇻',
    '🇹🇼',
    '🇹🇿',
    '🇹',
    '🇺🇦',
    '🇺🇬',
    '🇺🇲',
    '🇺🇳',
    '🇺🇸',
    '🇺🇾',
    '🇺🇿',
    '🇺',
    '🇻🇦',
    '🇻🇨',
    '🇻🇪',
    '🇻🇬',
    '🇻🇮',
    '🇻🇳',
    '🇻🇺',
    '🇻',
    '🇼🇫',
    '🇼🇸',
    '🇼',
    '🇽🇰',
    '🇽',
    '🇾🇪',
    '🇾🇹',
    '🇾',
    '🇿🇦',
    '🇿🇲',
    '🇿🇼',
    '🇿',
    '🈁',
    '🈂',
    '🈚',
    '🈯',
    '🈲',
    '🈳',
    '🈴',
    '🈵',
    '🈶',
    '🈷',
    '🈸',
    '🈹',
    '🈺',
    '🉐',
    '🉑',
    '🌀',
    '🌁',
    '🌂',
    '🌃',
    '🌄',
    '🌅',
    '🌆',
    '🌇',
    '🌈',
    '🌉',
    '🌊',
    '🌋',
    '🌌',
    '🌍',
    '🌎',
    '🌏',
    '🌐',
    '🌑',
    '🌒',
    '🌓',
    '🌔',
    '🌕',
    '🌖',
    '🌗',
    '🌘',
    '🌙',
    '🌚',
    '🌛',
    '🌜',
    '🌝',
    '🌞',
    '🌟',
    '🌠',
    '🌡',
    '🌤',
    '🌥',
    '🌦',
    '🌧',
    '🌨',
    '🌩',
    '🌪',
    '🌫',
    '🌬',
    '🌭',
    '🌮',
    '🌯',
    '🌰',
    '🌱',
    '🌲',
    '🌳',
    '🌴',
    '🌵',
    '🌶',
    '🌷',
    '🌸',
    '🌹',
    '🌺',
    '🌻',
    '🌼',
    '🌽',
    '🌾',
    '🌿',
    '🍀',
    '🍁',
    '🍂',
    '🍃',
    '🍄',
    '🍅',
    '🍆',
    '🍇',
    '🍈',
    '🍉',
    '🍊',
    '🍋',
    '🍌',
    '🍍',
    '🍎',
    '🍏',
    '🍐',
    '🍑',
    '🍒',
    '🍓',
    '🍔',
    '🍕',
    '🍖',
    '🍗',
    '🍘',
    '🍙',
    '🍚',
    '🍛',
    '🍜',
    '🍝',
    '🍞',
    '🍟',
    '🍠',
    '🍡',
    '🍢',
    '🍣',
    '🍤',
    '🍥',
    '🍦',
    '🍧',
    '🍨',
    '🍩',
    '🍪',
    '🍫',
    '🍬',
    '🍭',
    '🍮',
    '🍯',
    '🍰',
    '🍱',
    '🍲',
    '🍳',
    '🍴',
    '🍵',
    '🍶',
    '🍷',
    '🍸',
    '🍹',
    '🍺',
    '🍻',
    '🍼',
    '🍽',
    '🍾',
    '🍿',
    '🎀',
    '🎁',
    '🎂',
    '🎃',
    '🎄',
    '🎅🏻',
    '🎅🏼',
    '🎅🏽',
    '🎅🏾',
    '🎅🏿',
    '🎅',
    '🎆',
    '🎇',
    '🎈',
    '🎉',
    '🎊',
    '🎋',
    '🎌',
    '🎍',
    '🎎',
    '🎏',
    '🎐',
    '🎑',
    '🎒',
    '🎓',
    '🎖',
    '🎗',
    '🎙',
    '🎚',
    '🎛',
    '🎞',
    '🎟',
    '🎠',
    '🎡',
    '🎢',
    '🎣',
    '🎤',
    '🎥',
    '🎦',
    '🎧',
    '🎨',
    '🎩',
    '🎪',
    '🎫',
    '🎬',
    '🎭',
    '🎮',
    '🎯',
    '🎰',
    '🎱',
    '🎲',
    '🎳',
    '🎴',
    '🎵',
    '🎶',
    '🎷',
    '🎸',
    '🎹',
    '🎺',
    '🎻',
    '🎼',
    '🎽',
    '🎾',
    '🎿',
    '🏀',
    '🏁',
    '🏂🏻',
    '🏂🏼',
    '🏂🏽',
    '🏂🏾',
    '🏂🏿',
    '🏂',
    '🏃🏻‍♀️',
    '🏃🏻‍♂️',
    '🏃🏻',
    '🏃🏼‍♀️',
    '🏃🏼‍♂️',
    '🏃🏼',
    '🏃🏽‍♀️',
    '🏃🏽‍♂️',
    '🏃🏽',
    '🏃🏾‍♀️',
    '🏃🏾‍♂️',
    '🏃🏾',
    '🏃🏿‍♀️',
    '🏃🏿‍♂️',
    '🏃🏿',
    '🏃‍♀️',
    '🏃‍♂️',
    '🏃',
    '🏄🏻‍♀️',
    '🏄🏻‍♂️',
    '🏄🏻',
    '🏄🏼‍♀️',
    '🏄🏼‍♂️',
    '🏄🏼',
    '🏄🏽‍♀️',
    '🏄🏽‍♂️',
    '🏄🏽',
    '🏄🏾‍♀️',
    '🏄🏾‍♂️',
    '🏄🏾',
    '🏄🏿‍♀️',
    '🏄🏿‍♂️',
    '🏄🏿',
    '🏄‍♀️',
    '🏄‍♂️',
    '🏄',
    '🏅',
    '🏆',
    '🏇🏻',
    '🏇🏼',
    '🏇🏽',
    '🏇🏾',
    '🏇🏿',
    '🏇',
    '🏈',
    '🏉',
    '🏊🏻‍♀️',
    '🏊🏻‍♂️',
    '🏊🏻',
    '🏊🏼‍♀️',
    '🏊🏼‍♂️',
    '🏊🏼',
    '🏊🏽‍♀️',
    '🏊🏽‍♂️',
    '🏊🏽',
    '🏊🏾‍♀️',
    '🏊🏾‍♂️',
    '🏊🏾',
    '🏊🏿‍♀️',
    '🏊🏿‍♂️',
    '🏊🏿',
    '🏊‍♀️',
    '🏊‍♂️',
    '🏊',
    '🏋🏻‍♀️',
    '🏋🏻‍♂️',
    '🏋🏻',
    '🏋🏼‍♀️',
    '🏋🏼‍♂️',
    '🏋🏼',
    '🏋🏽‍♀️',
    '🏋🏽‍♂️',
    '🏋🏽',
    '🏋🏾‍♀️',
    '🏋🏾‍♂️',
    '🏋🏾',
    '🏋🏿‍♀️',
    '🏋🏿‍♂️',
    '🏋🏿',
    '🏋️‍♀️',
    '🏋️‍♂️',
    '🏋',
    '🏌🏻‍♀️',
    '🏌🏻‍♂️',
    '🏌🏻',
    '🏌🏼‍♀️',
    '🏌🏼‍♂️',
    '🏌🏼',
    '🏌🏽‍♀️',
    '🏌🏽‍♂️',
    '🏌🏽',
    '🏌🏾‍♀️',
    '🏌🏾‍♂️',
    '🏌🏾',
    '🏌🏿‍♀️',
    '🏌🏿‍♂️',
    '🏌🏿',
    '🏌️‍♀️',
    '🏌️‍♂️',
    '🏌',
    '🏍',
    '🏎',
    '🏏',
    '🏐',
    '🏑',
    '🏒',
    '🏓',
    '🏔',
    '🏕',
    '🏖',
    '🏗',
    '🏘',
    '🏙',
    '🏚',
    '🏛',
    '🏜',
    '🏝',
    '🏞',
    '🏟',
    '🏠',
    '🏡',
    '🏢',
    '🏣',
    '🏤',
    '🏥',
    '🏦',
    '🏧',
    '🏨',
    '🏩',
    '🏪',
    '🏫',
    '🏬',
    '🏭',
    '🏮',
    '🏯',
    '🏰',
    '🏳️‍🌈',
    '🏳',
    '🏴‍☠️',
    '🏴',
    '🏵',
    '🏷',
    '🏸',
    '🏹',
    '🏺',
    '🏻',
    '🏼',
    '🏽',
    '🏾',
    '🏿',
    '🐀',
    '🐁',
    '🐂',
    '🐃',
    '🐄',
    '🐅',
    '🐆',
    '🐇',
    '🐈',
    '🐉',
    '🐊',
    '🐋',
    '🐌',
    '🐍',
    '🐎',
    '🐏',
    '🐐',
    '🐑',
    '🐒',
    '🐓',
    '🐔',
    '🐕',
    '🐖',
    '🐗',
    '🐘',
    '🐙',
    '🐚',
    '🐛',
    '🐜',
    '🐝',
    '🐞',
    '🐟',
    '🐠',
    '🐡',
    '🐢',
    '🐣',
    '🐤',
    '🐥',
    '🐦',
    '🐧',
    '🐨',
    '🐩',
    '🐪',
    '🐫',
    '🐬',
    '🐭',
    '🐮',
    '🐯',
    '🐰',
    '🐱',
    '🐲',
    '🐳',
    '🐴',
    '🐵',
    '🐶',
    '🐷',
    '🐸',
    '🐹',
    '🐺',
    '🐻',
    '🐼',
    '🐽',
    '🐾',
    '🐿',
    '👀',
    '👁‍🗨',
    '👁',
    '👂🏻',
    '👂🏼',
    '👂🏽',
    '👂🏾',
    '👂🏿',
    '👂',
    '👃🏻',
    '👃🏼',
    '👃🏽',
    '👃🏾',
    '👃🏿',
    '👃',
    '👄',
    '👅',
    '👆🏻',
    '👆🏼',
    '👆🏽',
    '👆🏾',
    '👆🏿',
    '👆',
    '👇🏻',
    '👇🏼',
    '👇🏽',
    '👇🏾',
    '👇🏿',
    '👇',
    '👈🏻',
    '👈🏼',
    '👈🏽',
    '👈🏾',
    '👈🏿',
    '👈',
    '👉🏻',
    '👉🏼',
    '👉🏽',
    '👉🏾',
    '👉🏿',
    '👉',
    '👊🏻',
    '👊🏼',
    '👊🏽',
    '👊🏾',
    '👊🏿',
    '👊',
    '👋🏻',
    '👋🏼',
    '👋🏽',
    '👋🏾',
    '👋🏿',
    '👋',
    '👌🏻',
    '👌🏼',
    '👌🏽',
    '👌🏾',
    '👌🏿',
    '👌',
    '👍🏻',
    '👍🏼',
    '👍🏽',
    '👍🏾',
    '👍🏿',
    '👍',
    '👎🏻',
    '👎🏼',
    '👎🏽',
    '👎🏾',
    '👎🏿',
    '👎',
    '👏🏻',
    '👏🏼',
    '👏🏽',
    '👏🏾',
    '👏🏿',
    '👏',
    '👐🏻',
    '👐🏼',
    '👐🏽',
    '👐🏾',
    '👐🏿',
    '👐',
    '👑',
    '👒',
    '👓',
    '👔',
    '👕',
    '👖',
    '👗',
    '👘',
    '👙',
    '👚',
    '👛',
    '👜',
    '👝',
    '👞',
    '👟',
    '👠',
    '👡',
    '👢',
    '👣',
    '👤',
    '👥',
    '👦🏻',
    '👦🏼',
    '👦🏽',
    '👦🏾',
    '👦🏿',
    '👦',
    '👧🏻',
    '👧🏼',
    '👧🏽',
    '👧🏾',
    '👧🏿',
    '👧',
    '👨🏻‍🌾',
    '👨🏻‍🍳',
    '👨🏻‍🎓',
    '👨🏻‍🎤',
    '👨🏻‍🎨',
    '👨🏻‍🏫',
    '👨🏻‍🏭',
    '👨🏻‍💻',
    '👨🏻‍💼',
    '👨🏻‍🔧',
    '👨🏻‍🔬',
    '👨🏻‍🚀',
    '👨🏻‍🚒',
    '👨🏻‍⚕️',
    '👨🏻‍⚖️',
    '👨🏻‍✈️',
    '👨🏻',
    '👨🏼‍🌾',
    '👨🏼‍🍳',
    '👨🏼‍🎓',
    '👨🏼‍🎤',
    '👨🏼‍🎨',
    '👨🏼‍🏫',
    '👨🏼‍🏭',
    '👨🏼‍💻',
    '👨🏼‍💼',
    '👨🏼‍🔧',
    '👨🏼‍🔬',
    '👨🏼‍🚀',
    '👨🏼‍🚒',
    '👨🏼‍⚕️',
    '👨🏼‍⚖️',
    '👨🏼‍✈️',
    '👨🏼',
    '👨🏽‍🌾',
    '👨🏽‍🍳',
    '👨🏽‍🎓',
    '👨🏽‍🎤',
    '👨🏽‍🎨',
    '👨🏽‍🏫',
    '👨🏽‍🏭',
    '👨🏽‍💻',
    '👨🏽‍💼',
    '👨🏽‍🔧',
    '👨🏽‍🔬',
    '👨🏽‍🚀',
    '👨🏽‍🚒',
    '👨🏽‍⚕️',
    '👨🏽‍⚖️',
    '👨🏽‍✈️',
    '👨🏽',
    '👨🏾‍🌾',
    '👨🏾‍🍳',
    '👨🏾‍🎓',
    '👨🏾‍🎤',
    '👨🏾‍🎨',
    '👨🏾‍🏫',
    '👨🏾‍🏭',
    '👨🏾‍💻',
    '👨🏾‍💼',
    '👨🏾‍🔧',
    '👨🏾‍🔬',
    '👨🏾‍🚀',
    '👨🏾‍🚒',
    '👨🏾‍⚕️',
    '👨🏾‍⚖️',
    '👨🏾‍✈️',
    '👨🏾',
    '👨🏿‍🌾',
    '👨🏿‍🍳',
    '👨🏿‍🎓',
    '👨🏿‍🎤',
    '👨🏿‍🎨',
    '👨🏿‍🏫',
    '👨🏿‍🏭',
    '👨🏿‍💻',
    '👨🏿‍💼',
    '👨🏿‍🔧',
    '👨🏿‍🔬',
    '👨🏿‍🚀',
    '👨🏿‍🚒',
    '👨🏿‍⚕️',
    '👨🏿‍⚖️',
    '👨🏿‍✈️',
    '👨🏿',
    '👨‍🌾',
    '👨‍🍳',
    '👨‍🎓',
    '👨‍🎤',
    '👨‍🎨',
    '👨‍🏫',
    '👨‍🏭',
    '👨‍👦‍👦',
    '👨‍👦',
    '👨‍👧‍👦',
    '👨‍👧‍👧',
    '👨‍👧',
    '👨‍👨‍👦‍👦',
    '👨‍👨‍👦',
    '👨‍👨‍👧‍👦',
    '👨‍👨‍👧‍👧',
    '👨‍👨‍👧',
    '👨‍👩‍👦‍👦',
    '👨‍👩‍👦',
    '👨‍👩‍👧‍👦',
    '👨‍👩‍👧‍👧',
    '👨‍👩‍👧',
    '👨‍💻',
    '👨‍💼',
    '👨‍🔧',
    '👨‍🔬',
    '👨‍🚀',
    '👨‍🚒',
    '👨‍⚕️',
    '👨‍⚖️',
    '👨‍✈️',
    '👨‍❤️‍👨',
    '👨‍❤️‍💋‍👨',
    '👨',
    '👩🏻‍🌾',
    '👩🏻‍🍳',
    '👩🏻‍🎓',
    '👩🏻‍🎤',
    '👩🏻‍🎨',
    '👩🏻‍🏫',
    '👩🏻‍🏭',
    '👩🏻‍💻',
    '👩🏻‍💼',
    '👩🏻‍🔧',
    '👩🏻‍🔬',
    '👩🏻‍🚀',
    '👩🏻‍🚒',
    '👩🏻‍⚕️',
    '👩🏻‍⚖️',
    '👩🏻‍✈️',
    '👩🏻',
    '👩🏼‍🌾',
    '👩🏼‍🍳',
    '👩🏼‍🎓',
    '👩🏼‍🎤',
    '👩🏼‍🎨',
    '👩🏼‍🏫',
    '👩🏼‍🏭',
    '👩🏼‍💻',
    '👩🏼‍💼',
    '👩🏼‍🔧',
    '👩🏼‍🔬',
    '👩🏼‍🚀',
    '👩🏼‍🚒',
    '👩🏼‍⚕️',
    '👩🏼‍⚖️',
    '👩🏼‍✈️',
    '👩🏼',
    '👩🏽‍🌾',
    '👩🏽‍🍳',
    '👩🏽‍🎓',
    '👩🏽‍🎤',
    '👩🏽‍🎨',
    '👩🏽‍🏫',
    '👩🏽‍🏭',
    '👩🏽‍💻',
    '👩🏽‍💼',
    '👩🏽‍🔧',
    '👩🏽‍🔬',
    '👩🏽‍🚀',
    '👩🏽‍🚒',
    '👩🏽‍⚕️',
    '👩🏽‍⚖️',
    '👩🏽‍✈️',
    '👩🏽',
    '👩🏾‍🌾',
    '👩🏾‍🍳',
    '👩🏾‍🎓',
    '👩🏾‍🎤',
    '👩🏾‍🎨',
    '👩🏾‍🏫',
    '👩🏾‍🏭',
    '👩🏾‍💻',
    '👩🏾‍💼',
    '👩🏾‍🔧',
    '👩🏾‍🔬',
    '👩🏾‍🚀',
    '👩🏾‍🚒',
    '👩🏾‍⚕️',
    '👩🏾‍⚖️',
    '👩🏾‍✈️',
    '👩🏾',
    '👩🏿‍🌾',
    '👩🏿‍🍳',
    '👩🏿‍🎓',
    '👩🏿‍🎤',
    '👩🏿‍🎨',
    '👩🏿‍🏫',
    '👩🏿‍🏭',
    '👩🏿‍💻',
    '👩🏿‍💼',
    '👩🏿‍🔧',
    '👩🏿‍🔬',
    '👩🏿‍🚀',
    '👩🏿‍🚒',
    '👩🏿‍⚕️',
    '👩🏿‍⚖️',
    '👩🏿‍✈️',
    '👩🏿',
    '👩‍🌾',
    '👩‍🍳',
    '👩‍🎓',
    '👩‍🎤',
    '👩‍🎨',
    '👩‍🏫',
    '👩‍🏭',
    '👩‍👦‍👦',
    '👩‍👦',
    '👩‍👧‍👦',
    '👩‍👧‍👧',
    '👩‍👧',
    '👩‍👩‍👦‍👦',
    '👩‍👩‍👦',
    '👩‍👩‍👧‍👦',
    '👩‍👩‍👧‍👧',
    '👩‍👩‍👧',
    '👩‍💻',
    '👩‍💼',
    '👩‍🔧',
    '👩‍🔬',
    '👩‍🚀',
    '👩‍🚒',
    '👩‍⚕️',
    '👩‍⚖️',
    '👩‍✈️',
    '👩‍❤️‍👨',
    '👩‍❤️‍👩',
    '👩‍❤️‍💋‍👨',
    '👩‍❤️‍💋‍👩',
    '👩',
    '👪🏻',
    '👪🏼',
    '👪🏽',
    '👪🏾',
    '👪🏿',
    '👪',
    '👫🏻',
    '👫🏼',
    '👫🏽',
    '👫🏾',
    '👫🏿',
    '👫',
    '👬🏻',
    '👬🏼',
    '👬🏽',
    '👬🏾',
    '👬🏿',
    '👬',
    '👭🏻',
    '👭🏼',
    '👭🏽',
    '👭🏾',
    '👭🏿',
    '👭',
    '👮🏻‍♀️',
    '👮🏻‍♂️',
    '👮🏻',
    '👮🏼‍♀️',
    '👮🏼‍♂️',
    '👮🏼',
    '👮🏽‍♀️',
    '👮🏽‍♂️',
    '👮🏽',
    '👮🏾‍♀️',
    '👮🏾‍♂️',
    '👮🏾',
    '👮🏿‍♀️',
    '👮🏿‍♂️',
    '👮🏿',
    '👮‍♀️',
    '👮‍♂️',
    '👮',
    '👯🏻‍♀️',
    '👯🏻‍♂️',
    '👯🏻',
    '👯🏼‍♀️',
    '👯🏼‍♂️',
    '👯🏼',
    '👯🏽‍♀️',
    '👯🏽‍♂️',
    '👯🏽',
    '👯🏾‍♀️',
    '👯🏾‍♂️',
    '👯🏾',
    '👯🏿‍♀️',
    '👯🏿‍♂️',
    '👯🏿',
    '👯‍♀️',
    '👯‍♂️',
    '👯',
    '👰🏻',
    '👰🏼',
    '👰🏽',
    '👰🏾',
    '👰🏿',
    '👰',
    '👱🏻‍♀️',
    '👱🏻‍♂️',
    '👱🏻',
    '👱🏼‍♀️',
    '👱🏼‍♂️',
    '👱🏼',
    '👱🏽‍♀️',
    '👱🏽‍♂️',
    '👱🏽',
    '👱🏾‍♀️',
    '👱🏾‍♂️',
    '👱🏾',
    '👱🏿‍♀️',
    '👱🏿‍♂️',
    '👱🏿',
    '👱‍♀️',
    '👱‍♂️',
    '👱',
    '👲🏻',
    '👲🏼',
    '👲🏽',
    '👲🏾',
    '👲🏿',
    '👲',
    '👳🏻‍♀️',
    '👳🏻‍♂️',
    '👳🏻',
    '👳🏼‍♀️',
    '👳🏼‍♂️',
    '👳🏼',
    '👳🏽‍♀️',
    '👳🏽‍♂️',
    '👳🏽',
    '👳🏾‍♀️',
    '👳🏾‍♂️',
    '👳🏾',
    '👳🏿‍♀️',
    '👳🏿‍♂️',
    '👳🏿',
    '👳‍♀️',
    '👳‍♂️',
    '👳',
    '👴🏻',
    '👴🏼',
    '👴🏽',
    '👴🏾',
    '👴🏿',
    '👴',
    '👵🏻',
    '👵🏼',
    '👵🏽',
    '👵🏾',
    '👵🏿',
    '👵',
    '👶🏻',
    '👶🏼',
    '👶🏽',
    '👶🏾',
    '👶🏿',
    '👶',
    '👷🏻‍♀️',
    '👷🏻‍♂️',
    '👷🏻',
    '👷🏼‍♀️',
    '👷🏼‍♂️',
    '👷🏼',
    '👷🏽‍♀️',
    '👷🏽‍♂️',
    '👷🏽',
    '👷🏾‍♀️',
    '👷🏾‍♂️',
    '👷🏾',
    '👷🏿‍♀️',
    '👷🏿‍♂️',
    '👷🏿',
    '👷‍♀️',
    '👷‍♂️',
    '👷',
    '👸🏻',
    '👸🏼',
    '👸🏽',
    '👸🏾',
    '👸🏿',
    '👸',
    '👹',
    '👺',
    '👻',
    '👼🏻',
    '👼🏼',
    '👼🏽',
    '👼🏾',
    '👼🏿',
    '👼',
    '👽',
    '👾',
    '👿',
    '💀',
    '💁🏻‍♀️',
    '💁🏻‍♂️',
    '💁🏻',
    '💁🏼‍♀️',
    '💁🏼‍♂️',
    '💁🏼',
    '💁🏽‍♀️',
    '💁🏽‍♂️',
    '💁🏽',
    '💁🏾‍♀️',
    '💁🏾‍♂️',
    '💁🏾',
    '💁🏿‍♀️',
    '💁🏿‍♂️',
    '💁🏿',
    '💁‍♀️',
    '💁‍♂️',
    '💁',
    '💂🏻‍♀️',
    '💂🏻‍♂️',
    '💂🏻',
    '💂🏼‍♀️',
    '💂🏼‍♂️',
    '💂🏼',
    '💂🏽‍♀️',
    '💂🏽‍♂️',
    '💂🏽',
    '💂🏾‍♀️',
    '💂🏾‍♂️',
    '💂🏾',
    '💂🏿‍♀️',
    '💂🏿‍♂️',
    '💂🏿',
    '💂‍♀️',
    '💂‍♂️',
    '💂',
    '💃🏻',
    '💃🏼',
    '💃🏽',
    '💃🏾',
    '💃🏿',
    '💃',
    '💄',
    '💅🏻',
    '💅🏼',
    '💅🏽',
    '💅🏾',
    '💅🏿',
    '💅',
    '💆🏻‍♀️',
    '💆🏻‍♂️',
    '💆🏻',
    '💆🏼‍♀️',
    '💆🏼‍♂️',
    '💆🏼',
    '💆🏽‍♀️',
    '💆🏽‍♂️',
    '💆🏽',
    '💆🏾‍♀️',
    '💆🏾‍♂️',
    '💆🏾',
    '💆🏿‍♀️',
    '💆🏿‍♂️',
    '💆🏿',
    '💆‍♀️',
    '💆‍♂️',
    '💆',
    '💇🏻‍♀️',
    '💇🏻‍♂️',
    '💇🏻',
    '💇🏼‍♀️',
    '💇🏼‍♂️',
    '💇🏼',
    '💇🏽‍♀️',
    '💇🏽‍♂️',
    '💇🏽',
    '💇🏾‍♀️',
    '💇🏾‍♂️',
    '💇🏾',
    '💇🏿‍♀️',
    '💇🏿‍♂️',
    '💇🏿',
    '💇‍♀️',
    '💇‍♂️',
    '💇',
    '💈',
    '💉',
    '💊',
    '💋',
    '💌',
    '💍',
    '💎',
    '💏',
    '💐',
    '💑',
    '💒',
    '💓',
    '💔',
    '💕',
    '💖',
    '💗',
    '💘',
    '💙',
    '💚',
    '💛',
    '💜',
    '💝',
    '💞',
    '💟',
    '💠',
    '💡',
    '💢',
    '💣',
    '💤',
    '💥',
    '💦',
    '💧',
    '💨',
    '💩',
    '💪🏻',
    '💪🏼',
    '💪🏽',
    '💪🏾',
    '💪🏿',
    '💪',
    '💫',
    '💬',
    '💭',
    '💮',
    '💯',
    '💰',
    '💱',
    '💲',
    '💳',
    '💴',
    '💵',
    '💶',
    '💷',
    '💸',
    '💹',
    '💺',
    '💻',
    '💼',
    '💽',
    '💾',
    '💿',
    '📀',
    '📁',
    '📂',
    '📃',
    '📄',
    '📅',
    '📆',
    '📇',
    '📈',
    '📉',
    '📊',
    '📋',
    '📌',
    '📍',
    '📎',
    '📏',
    '📐',
    '📑',
    '📒',
    '📓',
    '📔',
    '📕',
    '📖',
    '📗',
    '📘',
    '📙',
    '📚',
    '📛',
    '📜',
    '📝',
    '📞',
    '📟',
    '📠',
    '📡',
    '📢',
    '📣',
    '📤',
    '📥',
    '📦',
    '📧',
    '📨',
    '📩',
    '📪',
    '📫',
    '📬',
    '📭',
    '📮',
    '📯',
    '📰',
    '📱',
    '📲',
    '📳',
    '📴',
    '📵',
    '📶',
    '📷',
    '📸',
    '📹',
    '📺',
    '📻',
    '📼',
    '📽',
    '📿',
    '🔀',
    '🔁',
    '🔂',
    '🔃',
    '🔄',
    '🔅',
    '🔆',
    '🔇',
    '🔈',
    '🔉',
    '🔊',
    '🔋',
    '🔌',
    '🔍',
    '🔎',
    '🔏',
    '🔐',
    '🔑',
    '🔒',
    '🔓',
    '🔔',
    '🔕',
    '🔖',
    '🔗',
    '🔘',
    '🔙',
    '🔚',
    '🔛',
    '🔜',
    '🔝',
    '🔞',
    '🔟',
    '🔠',
    '🔡',
    '🔢',
    '🔣',
    '🔤',
    '🔥',
    '🔦',
    '🔧',
    '🔨',
    '🔩',
    '🔪',
    '🔫',
    '🔬',
    '🔭',
    '🔮',
    '🔯',
    '🔰',
    '🔱',
    '🔲',
    '🔳',
    '🔴',
    '🔵',
    '🔶',
    '🔷',
    '🔸',
    '🔹',
    '🔺',
    '🔻',
    '🔼',
    '🔽',
    '🕉',
    '🕊',
    '🕋',
    '🕌',
    '🕍',
    '🕎',
    '🕐',
    '🕑',
    '🕒',
    '🕓',
    '🕔',
    '🕕',
    '🕖',
    '🕗',
    '🕘',
    '🕙',
    '🕚',
    '🕛',
    '🕜',
    '🕝',
    '🕞',
    '🕟',
    '🕠',
    '🕡',
    '🕢',
    '🕣',
    '🕤',
    '🕥',
    '🕦',
    '🕧',
    '🕯',
    '🕰',
    '🕳',
    '🕴🏻',
    '🕴🏼',
    '🕴🏽',
    '🕴🏾',
    '🕴🏿',
    '🕴',
    '🕵🏻‍♀️',
    '🕵🏻‍♂️',
    '🕵🏻',
    '🕵🏼‍♀️',
    '🕵🏼‍♂️',
    '🕵🏼',
    '🕵🏽‍♀️',
    '🕵🏽‍♂️',
    '🕵🏽',
    '🕵🏾‍♀️',
    '🕵🏾‍♂️',
    '🕵🏾',
    '🕵🏿‍♀️',
    '🕵🏿‍♂️',
    '🕵🏿',
    '🕵️‍♀️',
    '🕵️‍♂️',
    '🕵',
    '🕶',
    '🕷',
    '🕸',
    '🕹',
    '🕺🏻',
    '🕺🏼',
    '🕺🏽',
    '🕺🏾',
    '🕺🏿',
    '🕺',
    '🖇',
    '🖊',
    '🖋',
    '🖌',
    '🖍',
    '🖐🏻',
    '🖐🏼',
    '🖐🏽',
    '🖐🏾',
    '🖐🏿',
    '🖐',
    '🖕🏻',
    '🖕🏼',
    '🖕🏽',
    '🖕🏾',
    '🖕🏿',
    '🖕',
    '🖖🏻',
    '🖖🏼',
    '🖖🏽',
    '🖖🏾',
    '🖖🏿',
    '🖖',
    '🖤',
    '🖥',
    '🖨',
    '🖱',
    '🖲',
    '🖼',
    '🗂',
    '🗃',
    '🗄',
    '🗑',
    '🗒',
    '🗓',
    '🗜',
    '🗝',
    '🗞',
    '🗡',
    '🗣',
    '🗨',
    '🗯',
    '🗳',
    '🗺',
    '🗻',
    '🗼',
    '🗽',
    '🗾',
    '🗿',
    '😀',
    '😁',
    '😂',
    '😃',
    '😄',
    '😅',
    '😆',
    '😇',
    '😈',
    '😉',
    '😊',
    '😋',
    '😌',
    '😍',
    '😎',
    '😏',
    '😐',
    '😑',
    '😒',
    '😓',
    '😔',
    '😕',
    '😖',
    '😗',
    '😘',
    '😙',
    '😚',
    '😛',
    '😜',
    '😝',
    '😞',
    '😟',
    '😠',
    '😡',
    '😢',
    '😣',
    '😤',
    '😥',
    '😦',
    '😧',
    '😨',
    '😩',
    '😪',
    '😫',
    '😬',
    '😭',
    '😮',
    '😯',
    '😰',
    '😱',
    '😲',
    '😳',
    '😴',
    '😵',
    '😶',
    '😷',
    '😸',
    '😹',
    '😺',
    '😻',
    '😼',
    '😽',
    '😾',
    '😿',
    '🙀',
    '🙁',
    '🙂',
    '🙃',
    '🙄',
    '🙅🏻‍♀️',
    '🙅🏻‍♂️',
    '🙅🏻',
    '🙅🏼‍♀️',
    '🙅🏼‍♂️',
    '🙅🏼',
    '🙅🏽‍♀️',
    '🙅🏽‍♂️',
    '🙅🏽',
    '🙅🏾‍♀️',
    '🙅🏾‍♂️',
    '🙅🏾',
    '🙅🏿‍♀️',
    '🙅🏿‍♂️',
    '🙅🏿',
    '🙅‍♀️',
    '🙅‍♂️',
    '🙅',
    '🙆🏻‍♀️',
    '🙆🏻‍♂️',
    '🙆🏻',
    '🙆🏼‍♀️',
    '🙆🏼‍♂️',
    '🙆🏼',
    '🙆🏽‍♀️',
    '🙆🏽‍♂️',
    '🙆🏽',
    '🙆🏾‍♀️',
    '🙆🏾‍♂️',
    '🙆🏾',
    '🙆🏿‍♀️',
    '🙆🏿‍♂️',
    '🙆🏿',
    '🙆‍♀️',
    '🙆‍♂️',
    '🙆',
    '🙇🏻‍♀️',
    '🙇🏻‍♂️',
    '🙇🏻',
    '🙇🏼‍♀️',
    '🙇🏼‍♂️',
    '🙇🏼',
    '🙇🏽‍♀️',
    '🙇🏽‍♂️',
    '🙇🏽',

    '🙇🏾',

    '🙇🏿',

    '🙇',
    '🙈',
    '🙉',
    '🙊',

    '🙋🏻',

    '🙋🏼',

    '🙋🏽',

    '🙋🏾',

    '🙋🏿',

    '🙋',
    '🙌🏻',
    '🙌🏼',
    '🙌🏽',
    '🙌🏾',
    '🙌🏿',
    '🙌',

    '🙍🏻',

    '🙍🏼',

    '🙍🏽',

    '🙍🏾',

    '🙍🏿',

    '🙍',

    '🙎🏻',

    '🙎🏼',

    '🙎🏽',

    '🙎🏾',

    '🙎🏿',

    '🙎',
    '🙏🏻',
    '🙏🏼',
    '🙏🏽',
    '🙏🏾',
    '🙏🏿',
    '🙏',
    '🚀',
    '🚁',
    '🚂',
    '🚃',
    '🚄',
    '🚅',
    '🚆',
    '🚇',
    '🚈',
    '🚉',
    '🚊',
    '🚋',
    '🚌',
    '🚍',
    '🚎',
    '🚏',
    '🚐',
    '🚑',
    '🚒',
    '🚓',
    '🚔',
    '🚕',
    '🚖',
    '🚗',
    '🚘',
    '🚙',
    '🚚',
    '🚛',
    '🚜',
    '🚝',
    '🚞',
    '🚟',
    '🚠',
    '🚡',
    '🚢',

    '🚣',
    '🚤',
    '🚥',
    '🚦',
    '🚧',
    '🚨',
    '🚩',
    '🚪',
    '🚫',
    '🚬',
    '🚭',
    '🚮',
    '🚯',
    '🚰',
    '🚱',
    '🚲',
    '🚳',

    '🚴',

    '🚵',

    '🚶',
    '🚷',
    '🚸',
    '🚹',
    '🚺',
    '🚻',
    '🚼',
    '🚽',
    '🚾',
    '🚿',
    '🛀🏻',
    '🛀🏼',
    '🛀🏽',
    '🛀🏾',
    '🛀🏿',
    '🛀',
    '🛁',
    '🛂',
    '🛃',
    '🛄',
    '🛅',
    '🛋',
    '🛌🏻',
    '🛌🏼',
    '🛌🏽',
    '🛌🏾',
    '🛌🏿',
    '🛌',
    '🛍',
    '🛎',
    '🛏',
    '🛐',
    '🛑',
    '🛒',
    '🛠',
    '🛡',
    '🛢',
    '🛣',
    '🛤',
    '🛥',
    '🛩',
    '🛫',
    '🛬',
    '🛰',
    '🛳',
    '🛴',
    '🛵',
    '🛶',
    '🤐',
    '🤑',
    '🤒',
    '🤓',
    '🤔',
    '🤕',
    '🤖',
    '🤗',
    '🤘🏻',
    '🤘🏼',
    '🤘🏽',
    '🤘🏾',
    '🤘🏿',
    '🤘',
    '🤙🏻',
    '🤙🏼',
    '🤙🏽',
    '🤙🏾',
    '🤙🏿',
    '🤙',
    '🤚🏻',
    '🤚🏼',
    '🤚🏽',
    '🤚🏾',
    '🤚🏿',
    '🤚',
    '🤛🏻',
    '🤛🏼',
    '🤛🏽',
    '🤛🏾',
    '🤛🏿',
    '🤛',
    '🤜🏻',
    '🤜🏼',
    '🤜🏽',
    '🤜🏾',
    '🤜🏿',
    '🤜',
    '🤝',
    '🤞🏻',
    '🤞🏼',
    '🤞🏽',
    '🤞🏾',
    '🤞🏿',
    '🤞',
    '🤠',
    '🤡',
    '🤢',
    '🤣',
    '🤤',
    '🤥',

    '🤦',
    '🤧',
    '🤰🏻',
    '🤰🏼',
    '🤰🏽',
    '🤰🏾',
    '🤰🏿',
    '🤰',
    '🤳🏻',
    '🤳🏼',
    '🤳🏽',
    '🤳🏾',
    '🤳🏿',
    '🤳',
    '🤴🏻',
    '🤴🏼',
    '🤴🏽',
    '🤴🏾',
    '🤴🏿',
    '🤴',
    '🤵🏻',
    '🤵🏼',
    '🤵🏽',
    '🤵🏾',
    '🤵🏿',
    '🤵',
    '🤶🏻',
    '🤶🏼',
    '🤶🏽',
    '🤶🏾',
    '🤶🏿',
    '🤶',

    '🤷',

    '🤸',

    '🤹🏻',

    '🤹🏼',

    '🤹🏽',

    '🤹🏾',

    '🤹🏿',

    '🤹',
    '🤺',

    '🤼',

    '🤽🏻',

    '🤽🏼',

    '🤽🏽',

    '🤽🏾',

    '🤽🏿',

    '🤽',

    '🤾🏻',

    '🤾🏼',

    '🤾🏽',

    '🤾🏾',

    '🤾🏿',

    '🤾',
    '🥀',
    '🥁',
    '🥂',
    '🥃',
    '🥄',
    '🥅',
    '🥇',
    '🥈',
    '🥉',
    '🥊',
    '🥋',
    '🥐',
    '🥑',
    '🥒',
    '🥓',
    '🥔',
    '🥕',
    '🥖',
    '🥗',
    '🥘',
    '🥙',
    '🥚',
    '🥛',
    '🥜',
    '🥝',
    '🥞',
    '🦀',
    '🦁',
    '🦂',
    '🦃',
    '🦄',
    '🦅',
    '🦆',
    '🦇',
    '🦈',
    '🦉',
    '🦊',
    '🦋',
    '🦌',
    '🦍',
    '🦎',
    '🦏',
    '🦐',
    '🦑',
    '🧀',
    '‼',
    '⁉',
    '™',
    'ℹ',
    '↔',
    '↕',
    '↖',
    '↗',
    '↘',
    '↙',
    '↩',
    '↪',
    '#⃣',
    '⌚',
    '⌛',
    '⌨',
    '⏏',
    '⏩',
    '⏪',
    '⏫',
    '⏬',
    '⏭',
    '⏮',
    '⏯',
    '⏰',
    '⏱',
    '⏲',
    '⏳',
    '⏸',
    '⏹',
    '⏺',
    'Ⓜ',
    '▪',
    '▫',
    '▶',
    '◀',
    '◻',
    '◼',
    '◽',
    '◾',
    '☀',
    '☁',
    '☂',
    '☃',
    '☄',
    '☎',
    '☑',
    '☔',
    '☕',
    '☘',
    '☝🏻',
    '☝🏼',
    '☝🏽',
    '☝🏾',
    '☝🏿',
    '☝',
    '☠',
    '☢',
    '☣',
    '☦',
    '☪',
    '☮',
    '☯',
    '☸',
    '☹',
    '☺',
    '♀',
    '♂',
    '♈',
    '♉',
    '♊',
    '♋',
    '♌',
    '♍',
    '♎',
    '♏',
    '♐',
    '♑',
    '♒',
    '♓',
    '♠',
    '♣',
    '♥',
    '♦',
    '♨',
    '♻',
    '♿',
    '⚒',
    '⚓',
    '⚔',
    '⚕',
    '⚖',
    '⚗',
    '⚙',
    '⚛',
    '⚜',
    '⚠',
    '⚡',
    '⚪',
    '⚫',
    '⚰',
    '⚱',
    '⚽',
    '⚾',
    '⛄',
    '⛅',
    '⛈',
    '⛎',
    '⛏',
    '⛑',
    '⛓',
    '⛔',
    '⛩',
    '⛪',
    '⛰',
    '⛱',
    '⛲',
    '⛳',
    '⛴',
    '⛵',
    '⛷',
    '⛸',
    '⛹🏻‍♀️',
    '⛹🏻‍♂️',
    '⛹🏻',
    '⛹🏼‍♀️',
    '⛹🏼‍♂️',
    '⛹🏼',
    '⛹🏽‍♀️',
    '⛹🏽‍♂️',
    '⛹🏽',
    '⛹🏾‍♀️',
    '⛹🏾‍♂️',
    '⛹🏾',
    '⛹🏿‍♀️',
    '⛹🏿‍♂️',
    '⛹🏿',
    '⛹️‍♀️',
    '⛹️‍♂️',
    '⛹',
    '⛺',
    '⛽',
    '✂',
    '✅',
    '✈',
    '✉',
    '✊🏻',
    '✊🏼',
    '✊🏽',
    '✊🏾',
    '✊🏿',
    '✊',
    '✋🏻',
    '✋🏼',
    '✋🏽',
    '✋🏾',
    '✋🏿',
    '✋',
    '✌🏻',
    '✌🏼',
    '✌🏽',
    '✌🏾',
    '✌🏿',
    '✌',
    '✍🏻',
    '✍🏼',
    '✍🏽',
    '✍🏾',
    '✍🏿',
    '✍',
    '✏',
    '✒',
    '✔',
    '✖',
    '✝',
    '✡',
    '✨',
    '✳',
    '✴',
    '❄',
    '❇',
    '❌',
    '❎',
    '❓',
    '❔',
    '❕',
    '❗',
    '❣',
    '❤',
    '➕',
    '➖',
    '➗',
    '➡',
    '➰',
    '➿',
    '⤴',
    '⤵',
    '*⃣',
    '⬅',
    '⬆',
    '⬇',
    '⬛',
    '⬜',
    '⭐',
    '⭕',
    '0⃣',
    '〰',
    '〽',
    '1⃣',
    '2⃣',
    '㊗',
    '㊙',
    '3⃣',
    '4⃣',
    '5⃣',
    '6⃣',
    '7⃣',
    '8⃣',
    '9⃣'
  ]

  if (typeof option === 'number') {
    return allEmojisArray[option] || ''
  } else {
    return allEmojisArray.length > 0
      ? allEmojisArray[Math.floor(Math.random() * allEmojisArray.length)]
      : ''
  }
}

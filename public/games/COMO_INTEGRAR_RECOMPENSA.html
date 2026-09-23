<!--
  EXEMPLO DE INTEGRAÇÃO DE RECOMPENSA / VITÓRIA NO SEU JOGO (HTML/JS)
  
  Você NÃO precisa colocar código de anúncio dentro do seu jogo!
  Basta disparar esta linha de código JavaScript quando o jogador vencer ou pedir recompensa:
-->

<script>
  // 1. Quando o jogador vencer a fase ou o jogo:
  function onPlayerWin() {
    window.parent.postMessage({
      type: 'win',
      time: 45, // tempo em segundos (opcional)
      streak: 1 // dias seguidos (opcional)
    }, '*');
  }

  // Ou simplesmente:
  // window.parent.postMessage('win', '*');

  // 2. Quando o jogador pedir uma dica ou recompensa (Rewarded Ad):
  function requestRewardedAd(rewardType) {
    window.parent.postMessage({
      type: 'reward_request',
      reward: rewardType || 'hint'
    }, '*');
  }

  // 3. Ouvir quando o portal autorizar a recompensa:
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'reward_granted') {
      console.log('Recompensa concedida pelo portal!', event.data.reward);
      // Aqui você libera a dica ou vidas extras para o jogador!
    }
  });
</script>

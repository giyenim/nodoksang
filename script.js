// 공을 클릭하면 반대쪽 끝으로 굴러감
const ball = document.querySelector('.nav-circle');
const label = document.querySelector('.nav-label');

if (ball && label) {
  const before = label.querySelector('.nav-label-before');
  const after = label.querySelector('.nav-label-after');
  const startsRight = ball.classList.contains('is-right'); // 페이지를 열었을 때 공의 위치
  let rafId = null;

  // 공 중심을 경계로 왼쪽은 '하이퍼링크', 오른쪽은 '목차'를 보여 줌
  // 공이 경계 위를 덮고 있어서 공이 글자를 지우고 새 글자를 남기는 것처럼 보임
  function updateWipe() {
    const ballRect = ball.getBoundingClientRect();
    const ballCenter = ballRect.left + ballRect.width / 2;

    // 두 글자의 폭이 다르므로 각자의 상자 기준으로 경계 위치를 계산
    const beforeRect = before.getBoundingClientRect();
    const beforeEdge = Math.min(Math.max(ballCenter - beforeRect.left, 0), beforeRect.width);
    before.style.clipPath = `inset(0 0 0 ${beforeEdge}px)`;

    const afterRect = after.getBoundingClientRect();
    const afterEdge = Math.min(Math.max(ballCenter - afterRect.left, 0), afterRect.width);
    after.style.clipPath = `inset(0 ${afterRect.width - afterEdge}px 0 0)`;
  }

  // 공이 움직이는 동안 매 프레임 갱신
  function loop() {
    updateWipe();
    rafId = requestAnimationFrame(loop);
  }

  ball.addEventListener('click', () => {
    ball.classList.toggle('is-right');
    cancelAnimationFrame(rafId);
    loop();
  });

  ball.addEventListener('transitionend', (event) => {
    if (event.propertyName !== 'left') return;
    cancelAnimationFrame(rafId);
    updateWipe();

    // 공이 처음 위치의 반대쪽에 도착하면 nav의 data-href 페이지로 이동
    const href = ball.closest('.nav').dataset.href;
    if (href && ball.classList.contains('is-right') !== startsRight) {
      window.location.href = href;
    }
  });

  // 폰트가 로드되면 글자 폭이 바뀌므로 다시 계산
  window.addEventListener('load', updateWipe);
  updateWipe();
}

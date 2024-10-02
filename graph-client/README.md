  Apollo 패키지를 사용해 grapql서버와 클라이언트를 만들었습니다.
  
  Movie 컴포넌트에서 useQuery로 첫 요청시 id,title,rating,medium_cover_image는 캐시에 저장되지만 like는 저장되지 않습니다.
  그래서 매번 재방문시 모든 캐시된 데이터를 가져오지 못해 loading이 발생합니다.
  그러나 버튼 클릭시 Movie 캐시데이터에 like가 저장되므로 재방문시 모든 캐시데이터를 가져올 수 있어 loading발생하지 않습니다.
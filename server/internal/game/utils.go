package game

import (
	"math/rand/v2"

	"github.com/google/uuid"
	"github.com/martbul/realOrNot/internal/types"
)

func randRange(min, max int) int {
	return rand.IntN(max-min) + min
}
func Generate5Rounds() types.Round {
	images := []types.Round{
		{Img1URL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2vfCtI8fElei0k6DU4CutjwhPfFRnEJ0ECA&s", Img2URL: "https://img.freepik.com/premium-photo/natural-beauty-portrait-woman-autumn-forest_1351942-2475.jpg", Correct: "https://img.freepik.com/premium-photo/natural-beauty-portrait-woman-autumn-forest_1351942-2475.jpg"},

		{Img1URL: "https://www.cips-cepi.ca/wp-content/uploads/2023/01/51984569027_cf9c868471_k-1024x682.jpg", Img2URL: "https://img.freepik.com/premium-photo/imagine-super-realistic-depiction_1177187-200651.jpg", Correct: "https://www.cips-cepi.ca/wp-content/uploads/2023/01/51984569027_cf9c868471_k-1024x682.jpg"},
		{Img1URL: "https://images.nightcafe.studio/jobs/LsKoMO3fSy86UfNH9xcB/LsKoMO3fSy86UfNH9xcB--1--04sg6.jpg?tr=w-1600,c-at_max", Img2URL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c3fca29a-1697-425a-90ea-462af8345981/dal0g74-686a8def-94b7-43cb-a222-dfc06e6ba43c.jpg/v1/fill/w_1024,h_1536,q_75,strp/leather_armor_children_viking_celtic_by_lagueuse_dal0g74-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MzZmNhMjlhLTE2OTctNDI1YS05MGVhLTQ2MmFmODM0NTk4MVwvZGFsMGc3NC02ODZhOGRlZi05NGI3LTQzY2ItYTIyMi1kZmMwNmU2YmE0M2MuanBnIiwiaGVpZ2h0IjoiPD0xNTM2Iiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvYzNmY2EyOWEtMTY5Ny00MjVhLTkwZWEtNDYyYWY4MzQ1OTgxXC9sYWd1ZXVzZS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.7ELOlSzLFRR5EuJXOt492FBbab1wWBsEz9DPQ6SY83I", Correct: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c3fca29a-1697-425a-90ea-462af8345981/dal0g74-686a8def-94b7-43cb-a222-dfc06e6ba43c.jpg/v1/fill/w_1024,h_1536,q_75,strp/leather_armor_children_viking_celtic_by_lagueuse_dal0g74-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MzZmNhMjlhLTE2OTctNDI1YS05MGVhLTQ2MmFmODM0NTk4MVwvZGFsMGc3NC02ODZhOGRlZi05NGI3LTQzY2ItYTIyMi1kZmMwNmU2YmE0M2MuanBnIiwiaGVpZ2h0IjoiPD0xNTM2Iiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvYzNmY2EyOWEtMTY5Ny00MjVhLTkwZWEtNDYyYWY4MzQ1OTgxXC9sYWd1ZXVzZS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.7ELOlSzLFRR5EuJXOt492FBbab1wWBsEz9DPQ6SY83I"},
		{Img1URL: "https://www.asouthernsoul.com/wp-content/uploads/2024/03/fruit-salad-crowd-7-728x1092.jpg", Img2URL: "https://annoying-fluttering-hall.media.strapiapp.com/large_craiyon_155857_macro_photograph_of_juicy_purple_grape_bunch_in_a_bowl_on_a_table_hyper_realistic_ultra_detailed_texture_4k_67ca7fea67.png", Correct: "https://www.asouthernsoul.com/wp-content/uploads/2024/03/fruit-salad-crowd-7-728x1092.jpg"},
		{Img1URL: "https://theartandbeyond.com/wp-content/uploads/2022/11/pencil-sketch-3-1-819x1024.jpg", Img2URL: "https://viso.ai/wp-content/uploads/2022/07/dall-e-2-example-drawing-art.jpg", Correct: "https://theartandbeyond.com/wp-content/uploads/2022/11/pencil-sketch-3-1-819x1024.jpg"},
	}
	randomNum := randRange(0, 5)

	return images[randomNum]

}

func GenerateSessionID() string {
	return uuid.NewString()

}

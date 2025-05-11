<script>
// @ts-nocheck
    import {onMount} from "svelte";
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';
    let canal = {};
    const YOUTUBE_API_KEY = `AIzaSyAUrrD_KAr20eE03y0ZMJf9lTVRl2TCFDU`;
  
    onMount(async () => {
<<<<<<< HEAD
      const res = await fetch(`http://localhost:16078/api/yt/youtube/v3/channels?part=id%2Csnippet%2CcontentDetails&id=UCV4xOVpbcV8SdueDCOxLXtQ&key=${YOUTUBE_API_KEY}`)
=======
      const res = await fetch(`http://localhost:16078/api/yt/youtube/v3/channels?part=id%2Csnippet%2CcontentDetails&id=UCV4xOVpbcV8SdueDCOxLXtQ&key=${YOUTUBE_API_KEY}`);
>>>>>>> c1a0d5276b7f1def073dc0302c81c7da559b35c2
      const jsonStr = await res.text();
      const data = JSON.parse(jsonStr);
  
      const snippet = data.items[0].snippet;
      canal = {
        title: snippet.title,
        description: snippet.description,
        publishedAt: snippet.publishedAt
      };
    });
  </script>

<h2>Estadísticas del canal de Fernanfloo</h2>
<Table>
    <tbody>
        <tr>
            <td>
                <p>Título = {canal.title}</p>
            </td>
            <td>
                <p>Descripción = {canal.description}</p>
            </td>
            <td>
                <p>Fecha de Creación = {canal.publishedAt}</p>
            </td>
        </tr>
    </tbody>
</Table>

<script>
// @ts-nocheck

    import {onMount} from "svelte";
    import { Button, Table, Alert } from '@sveltestrap/sveltestrap';
    const YOUTUBE_API_KEY = `AIzaSyAUrrD_KAr20eE03y0ZMJf9lTVRl2TCFDU`;
    let canal = {};
  
    onMount(async () => {
      const res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id%2Csnippet%2CcontentDetails&id=UCV4xOVpbcV8SdueDCOxLXtQ&key=${YOUTUBE_API_KEY}`);
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

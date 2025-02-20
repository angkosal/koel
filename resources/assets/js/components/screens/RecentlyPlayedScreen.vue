<template>
  <section id="recentlyPlayedWrapper">
    <ScreenHeader :layout="songs.length === 0 ? 'collapsed' : headerLayout">
      Recently Played
      <ControlsToggle :showing-controls="showingControls" @toggleControls="toggleControls"/>

      <template v-slot:thumbnail>
        <ThumbnailStack :thumbnails="thumbnails"/>
      </template>

      <template v-slot:meta v-if="songs.length">
        <span>{{ pluralize(songs.length, 'song') }}</span>
        <span>{{ duration }}</span>
      </template>

      <template v-slot:controls>
        <SongListControls
          v-if="songs.length && (!isPhone || showingControls)"
          @playAll="playAll"
          @playSelected="playSelected"
        />
      </template>
    </ScreenHeader>

    <SongListSkeleton v-if="loading"/>
    <SongList v-if="songs.length" ref="songList" @press:enter="onPressEnter" @scroll-breakpoint="onScrollBreakpoint"/>

    <ScreenEmptyState v-else>
      <template v-slot:icon>
        <icon :icon="faClock"/>
      </template>
      No songs recently played.
      <span class="secondary d-block">Start playing to populate this playlist.</span>
    </ScreenEmptyState>
  </section>
</template>

<script lang="ts" setup>
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { eventBus, pluralize } from '@/utils'
import { recentlyPlayedStore } from '@/stores'
import { useSongList } from '@/composables'
import { ref, toRef } from 'vue'

import ScreenHeader from '@/components/ui/ScreenHeader.vue'
import ScreenEmptyState from '@/components/ui/ScreenEmptyState.vue'
import SongListSkeleton from '@/components/ui/skeletons/SongListSkeleton.vue'

const recentlyPlayedSongs = toRef(recentlyPlayedStore.state, 'songs')

const {
  SongList,
  SongListControls,
  ControlsToggle,
  ThumbnailStack,
  headerLayout,
  songs,
  songList,
  thumbnails,
  duration,
  showingControls,
  isPhone,
  onPressEnter,
  playAll,
  playSelected,
  toggleControls,
  onScrollBreakpoint
} = useSongList(recentlyPlayedSongs, 'recently-played', { sortable: false })

let initialized = false
let loading = ref(false)

eventBus.on({
  'LOAD_MAIN_CONTENT': async (view: MainViewName) => {
    if (view === 'RecentlyPlayed' && !initialized) {
      loading.value = true
      await recentlyPlayedStore.fetch()
      loading.value = false
      initialized = true
    }
  }
})
</script>

import { createElement, FragmentComp, render, TRenderJSX } from 'matul'
import { countMatches } from '../fun/countMatches'
import { cursorRange } from '../fun/cursorRange'
import { evaluate } from '../fun/evaluate'
import { formatMathResult } from '../fun/formatMathResult'
import { getPass } from '../fun/getPass'
import { IDialog } from '../interface/IDialog'
import { mathDecimal, mathFraction } from '../model/math'

export interface AppCompProps {}
export interface AppCompState {
	mathInput: string
	mathInputRef: HTMLInputElement
	mathOutputRef: HTMLInputElement
	uuidCopiedDialogRef: IDialog
	isFraction: boolean
	toast: string
	dialogRef: IDialog
	scope: { [k: string]: unknown }
}

export const AppComp: TRenderJSX<AppCompProps, AppCompState> = (_, v) => {
	v.state.mathInput = v.state.mathInput ?? ''
	v.state.isFraction = v.state.isFraction || false
	v.state.scope = v.state.scope || {}
	v.onupdated = () => {
		if (v.state.toast) {
			v.state.dialogRef?.showModal()
		} else {
			v.state.dialogRef?.close()
		}
	}
	function showToast(s: string) {
		v.state.toast = s
		setTimeout(() => {
			if (v.state.toast === s) {
				v.state.toast = undefined
				render()
			}
		}, 5000)
	}
	return (
		<>
			<div class='flex col padding-5px'>
				<input
					ref={(r: HTMLInputElement) => {
						v.state.mathInputRef = r
					}}
					class='x-stretch large-input'
					placeholder='Type here...'
					autofocus
					autocapitalize='off'
					value={v.state.mathInput}
					oninput={function (this: HTMLInputElement) {
						v.state.mathInput = this.value
						render()
					}}
					onkeydown={async (e: KeyboardEvent) => {
						switch (e.key) {
							case ')':
								await render()
								if (
									v.state.mathInputRef &&
									v.state.mathInput &&
									countMatches(v.state.mathInput, /\(/g) <
										countMatches(v.state.mathInput, /\)/g)
								) {
									let { start } = cursorRange(v.state.mathInputRef)
									v.state.mathInput = '(' + v.state.mathInput
									start++
									await render()
									if (v.state.mathInputRef) {
										v.state.mathInputRef.setSelectionRange(start, start)
									}
								}
								break
						}
					}}
					onkeyup={(e: KeyboardEvent) => {
						switch (e.key) {
							case 'Enter':
								if (v.state.mathOutputRef) {
									navigator.clipboard.writeText(v.state.mathOutputRef.value)
									showToast('Result copied!')
									render()
								}
								break
							case 'Escape':
								v.state.mathInput = ''
								render()
								break
						}
					}}
				/>
				<div class='flex row x-stretch'>
					<input
						ref={(r: HTMLInputElement) => {
							v.state.mathOutputRef = r
						}}
						class='x-stretch output'
						readOnly
						value={formatMathResult(
							evaluate(
								v.state.isFraction ? mathFraction : mathDecimal,
								v.state.mathInput,
								v.state.scope,
							),
							v.state.mathInput,
							v.state.isFraction,
						)}
					/>
					<button
						onclick={() => {
							if (v.state.mathOutputRef) {
								navigator.clipboard.writeText(v.state.mathOutputRef.value)
								showToast('Result copied!')
								render()
							}
						}}
					>
						Copy
					</button>
					<button
						onclick={async () => {
							if (v.state.mathOutputRef) {
								v.state.mathInput = v.state.mathOutputRef.value
								v.state.mathInputRef?.focus()
								await render()
								if (v.state.mathInputRef) {
									v.state.mathInputRef.focus()
									v.state.mathInputRef.setSelectionRange(
										v.state.mathInput.length,
										v.state.mathInput.length,
									)
								}
							}
						}}
					>
						Use
					</button>
					<button
						class='mono'
						onclick={async () => {
							v.state.mathInput = ''
							v.state.mathInputRef?.focus()
							await render()
							if (v.state.mathInputRef) {
								v.state.mathInputRef.focus()
							}
						}}
					>
						X
					</button>
				</div>
				<div class='flex row x-stretch'>
					<label>
						<input
							type='checkbox'
							checked={v.state.isFraction}
							onchange={function (this: HTMLInputElement) {
								v.state.isFraction = this.checked
								render()
							}}
						/>{' '}
						fraction
					</label>
					<button
						class='mono'
						onclick={() => {
							if (v.state.mathInputRef) {
								const { start, end } = cursorRange(v.state.mathInputRef)
								const cursor = start === end ? start - 1 : start
								v.state.mathInputRef.focus()
								v.state.mathInputRef.setSelectionRange(cursor, cursor)
							}
						}}
					>
						←
					</button>
					<button
						class='mono'
						onclick={() => {
							if (v.state.mathInputRef) {
								const { start, end } = cursorRange(v.state.mathInputRef)
								const cursor = start === end ? end + 1 : end
								v.state.mathInputRef.focus()
								v.state.mathInputRef.setSelectionRange(cursor, cursor)
							}
						}}
					>
						→
					</button>
					{['+', '-', '*', '/', '^', '%', '=', '(', ')'].map((char) => (
						<button
							key={char}
							class='mono'
							onclick={async () => {
								if (v.state.mathInputRef && v.state.mathInput != null) {
									const { start, end } = cursorRange(v.state.mathInputRef)
									v.state.mathInput =
										v.state.mathInput.slice(0, start) +
										char +
										v.state.mathInput.slice(end)
									let cursor = start + char.length
									if (
										char === ')' &&
										countMatches(v.state.mathInput, /\(/g) <
											countMatches(v.state.mathInput, /\)/g)
									) {
										v.state.mathInput = '(' + v.state.mathInput
										cursor++
									}
									v.state.mathInputRef?.focus()
									await render()
									if (v.state.mathInputRef) {
										v.state.mathInputRef.focus()
										v.state.mathInputRef.setSelectionRange(cursor, cursor)
									}
								}
							}}
						>
							{char}
						</button>
					))}
					<div class='flex row margin-left-auto justify-end'>
						<button
							onclick={() => {
								navigator.clipboard.writeText(crypto.randomUUID())
								showToast('UUID copied!')
								render()
							}}
						>
							UUID
						</button>
						<button
							onclick={() => {
								navigator.clipboard.writeText(
									new Date().toLocaleString('ja', {
										year: 'numeric',
										month: 'numeric',
										day: 'numeric',
										hour: 'numeric',
										minute: '2-digit',
										hourCycle: 'h24',
									}),
								)
								showToast('Time copied!')
								render()
							}}
						>
							Time
						</button>
						<button
							onclick={() => {
								navigator.clipboard.writeText(
									Math.floor(Date.now() / 1000).toString(36),
								)
								showToast('Time 36 copied!')
								render()
							}}
						>
							Time 36
						</button>
						<button
							onclick={() => {
								navigator.clipboard.writeText(
									getPass(
										`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`,
									),
								)
								showToast('Pass copied!')
								render()
							}}
						>
							Pass
						</button>
						<button
							onclick={() => {
								navigator.clipboard.writeText(
									getPass(
										`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=<>^%$@#&~{}()[]|;,.?!`,
									),
								)
								showToast('Pass 2 copied!')
								render()
							}}
						>
							Pass 2
						</button>
					</div>
				</div>
				{Object.keys(v.state.scope).map((key) => (
					<div key={key}>
						{key} ={' '}
						{formatMathResult(v.state.scope![key], '?', v.state.isFraction!)}{' '}
						<button
							onclick={() => {
								delete v.state.scope![key]
								render()
							}}
						>
							X
						</button>
					</div>
				))}
				<div class='remark'>2022/5/17 17:45</div>
			</div>
			<dialog
				ref={(r: IDialog) => {
					v.state.dialogRef = r
				}}
				onclick={() => {
					v.state.toast = undefined
					render()
				}}
			>
				{v.state.toast}
			</dialog>
		</>
	)
}
